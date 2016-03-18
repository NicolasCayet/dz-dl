import {Component} from 'angular2/core';
import {Track} from '../entities/track.entity'
import {TracksService} from './tracks.service'
import {HTTP_PROVIDERS} from "angular2/http";
import {DeezerParsingService} from "../deezer/deezerParsing.service";

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
        private _service:TracksService,
        private _deezerParsingService: DeezerParsingService
    )
    {}

    fetchTracks(){
        this.getTracks();
    }

    getTracks(){
        // Deezer IMPL
        if(this.id) {
            if(this.listType){
                let obs = this._service.getTracksByType(this.id.toString(),this.listType);
                obs.subscribe(
                    result => this.trackList = this._deezerParsingService.handleJsonTracks(result),
                    error => {

                    }
                );
            }
        }
    }
}
