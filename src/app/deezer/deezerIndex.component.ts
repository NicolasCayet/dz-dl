import {Component} from 'angular2/core';
import {Track} from '../entities/track.entity'
import {TracksService} from '../tracks/tracks.service'
import {HTTP_PROVIDERS} from "angular2/http";
import {DeezerParsingService} from "../deezer/deezerParsing.service";
import {SimpleChange} from "angular2/core";
import {TracksComponent} from "../tracks/tracks-index.component";

@Component({
    selector: 'my-deezer-form',
    templateUrl: 'app/deezer/deezerIndex.component.html',
    styleUrls: ['app/deezer/deezerIndex.component.css'],
    viewProviders: [HTTP_PROVIDERS],
    directives: [TracksComponent]
})
export class DeezerIndexComponent {
    dzTrackList: Track[];

    // Deezer playlist/album ID parameters
    id: string;
    listType: string;

    exempleByType: any;

    // Not suppose to stay here
    exemplesList: any[][] = [
        //Playlists
        [
            {name: "Découvertes", id:"1389164505"},
            {name: "Chill - Relax", id:"1290316405"},
            {name: "Deezer Hits", id:"1363560485"}
        ],
        //Albums
        [
            {name: "ANTI par Rihanna", id:"12279700"},
            {name: "Drones par Muse", id:"10506072"},
            {name: "Tetra par C2C", id:"5302151"}
        ]
    ];

    // Not suppose to stay here
    containerList: any[] = [
        {name:"Playlist",value:"playlist"},
        {name:"Album",value:"album"}
    ];

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
                    result => this.dzTrackList = this._deezerParsingService.handleJsonTracks(result),
                    error => {

                    }
                );
            }
        }
    }

    updateExempleInput(){
        if (this.listType == "playlist"){
            this.exempleByType = this.exemplesList[0];
        }
        else if(this.listType == "album") {
            this.exempleByType = this.exemplesList[1];
        }

    }
}
