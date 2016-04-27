import {Component, OnInit, Input} from 'angular2/core';
import {YoutubeSearchService, YoutubeSearchResult, YoutubeSearchFilters, YoutubeOrderBy, VideoDefinition} from './youtube-search.service';
import {TrackEntity} from '../entities/track.entity';
import {YoutubeSearchResultsComponent} from './youtube-search-results.component';
import {YoutubeOrderPipe} from './youtube-search.pipes';

@Component({
    selector: 'youtube-search',
    templateUrl: 'app/youtube-search/youtube-search.component.html',
    styles: [
        `.toggle-filters {
            float:left;
            margin-right: 3px;
            margin-bottom: 3px;
        }`
    ],
    directives: [YoutubeSearchResultsComponent],
    pipes: [YoutubeOrderPipe]
})
export class YoutubeSearchComponent implements OnInit {
    @Input('track') public track: TrackEntity;
    public filter: YoutubeSearchFilters;
    public youtubeSearchResults: YoutubeSearchResult[];

    private youtubeOrders = [];
    private showFilters = false;

    constructor(private _searchService: YoutubeSearchService) {
        for (let key in YoutubeOrderBy) {
            if (isNaN(+key)) {
                this.youtubeOrders.push(YoutubeOrderBy[key]);
            }
        }
    }

    ngOnInit() {
        if (!this.track) {
            // provide a sample
            this.track = { title:'Last Living Souls', artistName: 'Gorillaz', duration: 195, id: 0};
        }
        this.filter = {
            title: this.track.title,
            artistName: this.track.artistName,
            duration: this.track.duration,
            order: YoutubeOrderBy.RELEVANCE,
            definition: null
        }
        this.refresh();
    }

    refresh() {
        this._searchService.getByFilters(this.filter).subscribe(results => this.youtubeSearchResults = results);
    }

    private castToNumber(value) {
        return +value;
    }
}
