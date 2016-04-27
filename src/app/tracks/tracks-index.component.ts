import {Component} from 'angular2/core';
import {TrackEntity} from '../entities/track.entity'
import {YoutubeSearchComponent} from "../youtube-search/youtube-search.component";

@Component({
    selector: 'my-track-index',
    templateUrl: 'app/tracks/tracks-index.component.html',
    styleUrls: ['app/tracks/tracks-index.component.css'],
    directives: [YoutubeSearchComponent],
    inputs: ['trackList']
})
export class TracksComponent {
    trackList: TrackEntity[];
}
