import {Component, OnInit} from 'angular2/core';
import {YoutubeSearchService} from './youtube-search.service';
import {YoutubeSearchFilters} from './youtube-search.service';
import {YoutubeSearchResult} from './youtube-search.service';

@Component({
    selector: 'youtube-dl',
    templateUrl: 'app/youtube-search/youtube-search.component.html'
})
export class YoutubeSearchComponent implements OnInit {
    public searchResults: YoutubeSearchResult[] = [];

    constructor(private _searchService: YoutubeSearchService) {
        // this.tracks = tracks;
    }

    ngOnInit() {
        let mockFilter: YoutubeSearchFilters = { };
        this._searchService.getByFilters(mockFilter).subscribe(results => { this.searchResults = results; console.dir(results)});
    }
}
