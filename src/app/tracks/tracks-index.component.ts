import {Component} from 'angular2/core';
import {Track} from '../entities/track'
import {TracksService} from '../entities/tracks.service'

@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/tracks/tracks-index.component.html',
    styleUrls: ['app/tracks/tracks-index.component.css']
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
            if(this.listType == "album"){
                this._service.getAlbum(this.id.toString()).then(tracks => this.trackList = tracks);
            }
            else if(this.listType == "playlist") {
                this._service.getPlaylist(this.id.toString()).then(tracks => this.trackList = tracks);
            }
        }
    }
}
