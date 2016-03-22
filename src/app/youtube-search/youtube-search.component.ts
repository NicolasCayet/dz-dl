import {Component, OnInit} from 'angular2/core';
import {YoutubeSearchService, YoutubeSearchResult, YoutubeSearchFilters, YoutubeOrderBy, VideoDefinition} from './youtube-search.service';
import {TrackEntity} from '../entities/track.entity';
import {YoutubeSearchResultsComponent} from './youtube-search-results.component';

@Component({
    selector: 'youtube-search',
    templateUrl: 'app/youtube-search/youtube-search.component.html',
    directives: [YoutubeSearchResultsComponent]
})
export class YoutubeSearchComponent implements OnInit {
    public tracks: TrackEntity[];

    constructor(private _searchService: YoutubeSearchService) {
        // this.tracks = tracks;
        this.tracks = [
            { title:'Last Living Souls', artistName: 'Gorillaz', duration: 195, id: 0},
            { title:'Love Generation', artistName: 'Bob Sinclar', duration: 511, id: 0},
            { title:'All Star', artistName: 'Smash Mouth', duration: 201, id: 0}
        ];
    }

    ngOnInit() { }

    search() {
        let filter: YoutubeSearchFilters;
        let track: TrackEntity;
        for (let index in this.tracks) {
            track = this.tracks[index];
            filter = {
                title: track.title,
                artistName: track.artistName,
                duration: track.duration,
                order: YoutubeOrderBy.RELEVANCE,
                definition: null
            };
            this._searchService.getByFilters(filter).subscribe(results => {
                this.tracks[index].youtubeSearchResults = results; console.dir(results);
            });
        }
    }
}
