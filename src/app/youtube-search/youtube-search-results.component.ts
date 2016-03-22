import {Component, Input} from 'angular2/core';
import {RelevancePipe} from './youtube-search.pipes';
import {YoutubeSearchResult} from './youtube-search.service';

@Component({
    selector: 'youtube-search-results',
    templateUrl: 'app/youtube-search/youtube-search-results.component.html',
    inputs: ['searchResults'],
    pipes: [RelevancePipe]
})
export class YoutubeSearchResultsComponent {
}
