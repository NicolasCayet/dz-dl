import {Component} from 'angular2/core';
import {Track} from '../entities/track.entity'
import {TracksService} from './tracks.service'
import {HTTP_PROVIDERS} from "angular2/http";

@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/tracks/tracks-index.component.html',
    styleUrls: ['app/tracks/tracks-index.component.css'],
    viewProviders: [HTTP_PROVIDERS]
})
export class TracksComponent {
    trackList: Track[];

    // Deezer playlist/album ID parameters
    id: string;
    listType: string;

    constructor(
        private _service:TracksService)
    {}

    fetchTracks(){
        this.getTracks();
    }

    getTracks(){
        // Deezer IMPL
        if(this.id) {
            if(this.listType){
                this.trackList = this._service.getTracksByType(this.id.toString(),this.listType);
            }
        }
    }
}
