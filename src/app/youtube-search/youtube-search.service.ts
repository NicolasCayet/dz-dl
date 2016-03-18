import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {ConfigService} from '../common/config.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

export interface YoutubeSearchResult {
    videoId: string;
    title: string;
    smallImageUri: string;
};

/**
 * @todo Create a Directive displaying the modifiable filters criteria
 */
export interface YoutubeSearchFilters { };

export enum Relevance {
    FULLMATCH,
    HIGH,
    LOW,
    BAD
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
        return this._http.get('https://www.googleapis.com/youtube/v3/search' +
            '?part=snippet&order=viewCount' +
            '&q=rick+rolled+never+gonna' +
            '&type=video' +
            '&videoDefinition=high' +
            '&key=' + this.apiKey)
            .filter(response => response.status < 400)
            .map(response => response.json())
            .filter(response => response.hasOwnProperty('items'))
            .map(response => {
                let searchResults: YoutubeSearchResult[] = [];
                response.items.forEach(item => {
                    searchResults.push({
                        videoId: item.id.videoId,
                        title: item.snippet.title,
                        smallImageUri: item.snippet.thumbnails.default.url
                    });
                });
                return searchResults;
            });
    }
}
