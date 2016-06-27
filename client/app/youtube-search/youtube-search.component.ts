import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {YoutubeSearchService, YoutubeSearchResult, YoutubeSearchFilters, YoutubeOrderBy, VideoDefinition} from './youtube-search.service';
import {TrackEntity} from '../entities/track.entity';
import {YoutubeSearchResultsComponent} from './youtube-search-results.component';
import {YoutubeOrderPipe} from './youtube-search.pipes';
import {ContainerEntity} from "../entities/container.entity";

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
    @Input('container') public container: ContainerEntity;
    @Output('selected') selectedEvent = new EventEmitter<YoutubeSearchResult>();
    @Output() searching = new EventEmitter<boolean>();
    public filter: YoutubeSearchFilters;
    public youtubeSearchResults: YoutubeSearchResult[];
    public selected: YoutubeSearchResult;

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
        // strip title part between parentheses
        let title = this.track.title.replace(/\s*\(.+\)$/, '');

        this.filter = {
            title: title,
            artistName: this.track.artistName,
            duration: this.track.duration,
            order: YoutubeOrderBy.RELEVANCE,
            definition: null
        }
        this.refresh();
    }

    refresh() {
        this.selected = null;
        this.selectedEvent.emit(this.selected);
        this.searching.emit(true);
        this._searchService.getByFilters(this.filter).subscribe(results => {
            this.youtubeSearchResults = results;
            this.searching.emit(false);
        });
    }

    onSelected(value) {
        this.selected = value;
        this.selectedEvent.emit(this.selected);
    }

    private castToNumber(value) {
        return +value;
    }
}
