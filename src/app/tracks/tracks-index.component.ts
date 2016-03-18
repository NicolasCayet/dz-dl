import {Component} from 'angular2/core';
import {Track} from '../entities/track.entity'

@Component({
    selector: 'my-track-index',
    templateUrl: 'app/tracks/tracks-index.component.html',
    styleUrls: ['app/tracks/tracks-index.component.css'],
    inputs: ['trackList']
})
export class TracksComponent {
    trackList: Track[];
}



