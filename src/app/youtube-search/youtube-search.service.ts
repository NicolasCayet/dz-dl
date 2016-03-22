import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {ConfigService} from '../common/config.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {DateUtil} from '../common/date.util';

export interface YoutubeSearchResult {
    videoId: string;
    title: string;
    smallImageUri: string;
    relevance: Relevance;
    publishedAt: Date;
    duration: number; // in seconds
    definition: VideoDefinition; // VideoDefinition.HD value means it is also available in SD
};

export enum Relevance {
    FULLMATCH,
    HIGH,
    LOW,
    BAD
};

export enum VideoDefinition {
    HD,
    SD
};

interface YoutubeSearchApiResult {
    id: { videoId: string; };
    snippet: {
        title: string,
        publishedAt: string,
        thumbnails: {
            'default': { url: string; };
        };
    };
}

interface YoutubeVideoApiResult {
    id: string;
    contentDetails: {
        duration: string; // ISO 8601
        definition: string; // 'hd' or 'sd'. If 'hd', also available in standard definition
    }
}

/**
 * @todo Create a Directive displaying the modifiable filters criteria
 */
export interface YoutubeSearchFilters {
    title: string;
    artistName: string;
    duration: number;
    order: YoutubeOrderBy;
    definition: VideoDefinition;
};

export enum YoutubeOrderBy {
    RELEVANCE,
    DATE,
    VIEWCOUNT,
    RATING
};

/**
 * Allow to print alert messages (warning/success/danger) from anywhere in the app
 */
@Injectable()
export class YoutubeSearchService {
    private apiKey: string;

    constructor(private configService: ConfigService, private _http: Http) {
        this.apiKey = this.configService.get('google_api.key');
        if (!this.apiKey) {
            throw 'Google API key not configured.';
        }
    }

    getByFilters(filters: YoutubeSearchFilters): Observable<YoutubeSearchResult[]> {
        let query = filters.artistName + ' ' + filters.title;

        return this._http.get(this.buildVideoSearchUri(
                query,
                filters.definition,
                filters.order
            ))
            .filter(response => response.status < 400)
            .map(response => response.json())
            .filter(response => response.hasOwnProperty('items'))
            .flatMap(response => {
                // process another query to API getting video details (for videos' duration)
                let ids = response.items.map(item => item.id.videoId);
                let videoDetailsMap = new Map<string, YoutubeVideoApiResult>();
                let searchResults: YoutubeSearchResult[] = [];
                return this._http.get(this.buildVideosDetailsUri(ids))
                    .filter(detailsResponse => detailsResponse.status < 400)
                    .map(detailsResponse => detailsResponse.json())
                    .filter(detailsResponse => detailsResponse.hasOwnProperty('items'))
                    .map(detailsResponse => {
                        detailsResponse.items.forEach((item: YoutubeVideoApiResult) => {
                            videoDetailsMap.set(item.id, item);
                        });

                        response.items.forEach((item: YoutubeSearchApiResult) => {
                            searchResults.push(this.mapApiToSearchResult(item, videoDetailsMap.get(item.id.videoId)));
                        });

                        return searchResults;
                    });
            });
    }

    private buildVideoSearchUri(
        query: string,
        videoDefinition?: VideoDefinition,
        orderBy?: YoutubeOrderBy
    ): string {
        let fields = 'items(id(videoId),snippet)';
        let type = 'video';
        let maxResults = 5; // must be less than 50 to perform query GET /videos
        let regionCode = 'fr';
        let relevanceLang = 'fr';
        let definition: string = 'any';
        let order: string;

        query = query.replace('/\s/i', '+');
        switch (orderBy) {
            case YoutubeOrderBy.DATE:
                order = 'date';
                break;
            case YoutubeOrderBy.RELEVANCE:
                order = 'relevance';
                break;
            case YoutubeOrderBy.RATING:
                order = 'rating';
                break;
            default:
                order = 'viewCount';
        }
        if (videoDefinition === VideoDefinition.SD) {
            definition = 'standard';
        } else if (videoDefinition === VideoDefinition.HD) {
            definition = 'high';
        }

        let url = 'https://www.googleapis.com/youtube/v3/search' +
            '?part=snippet&order=' + order +
            '&q=' + query +
            '&type=' + type +
            '&videoDefinition=' + definition +
            '&fields=' + fields +
            '&maxResults=' + maxResults +
            '&regionCode=' + regionCode +
            '&relevanceLanguage=' + relevanceLang +
            '&key=' + this.apiKey;

        return url;
    }

    private buildVideosDetailsUri(ids: string[]): string {
        if (ids.length > 50 || ids.length <= 0) {
            throw 'Trying to get more details about Youtube videos but got an invalid number of ids (got ' + ids.length + ' instead of > 0 && <= 50)';
        }
        let fields = 'items(id,contentDetails(duration))';
        return 'https://www.googleapis.com/youtube/v3/videos' +
            '?part=contentDetails' +
            '&id=' + ids.join(',') +
            '&fields=' + fields +
            '&key=' + this.apiKey;
    }

    private mapApiToSearchResult(fromApi: YoutubeSearchApiResult, videoDetails: YoutubeVideoApiResult): YoutubeSearchResult {
        return {
            videoId: fromApi.id.videoId,
            title: fromApi.snippet.title,
            smallImageUri: fromApi.snippet.thumbnails.default.url,
            publishedAt: new Date(fromApi.snippet.publishedAt),
            relevance: null,
            duration: DateUtil.iso8601ToSec(videoDetails.contentDetails.duration),
            definition: videoDetails.contentDetails.definition === 'hd' ? VideoDefinition.HD : VideoDefinition.SD
        };
    }

    private resolveRelevance(result: YoutubeSearchResult, filters: YoutubeSearchFilters): YoutubeSearchResult {
        result.relevance = Relevance.BAD;

        return result;
    }
}
