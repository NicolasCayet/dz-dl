import {Component} from 'angular2/core';
import {TrackEntity} from '../entities/track.entity'
import {TracksService} from '../tracks/tracks.service'
import {HTTP_PROVIDERS} from "angular2/http";
import {DeezerParsingService} from "./deezer-parsing.service";
import {SimpleChange} from "angular2/core";
import {TracksComponent} from "../tracks/tracks-index.component";
import {OnInit} from 'angular2/core';
import {AuthenticationService} from "../auth/authentication.service";
import {ContainerEntity} from "../entities/container.entity";
import {ContainerDisplayComponent} from "../container/container-display.component";
import {AlertService} from "../app/alert.service";

@Component({
    selector: 'my-deezer-form',
    templateUrl: 'app/deezer/deezer-index.component.html',
    styleUrls: ['app/deezer/deezer-index.component.css'],
    viewProviders: [HTTP_PROVIDERS],
    directives: [TracksComponent,ContainerDisplayComponent]
})
export class DeezerIndexComponent implements OnInit {
    dzTrackList: TrackEntity[];
    dzPlaylists: ContainerEntity[];
    dzAlbums: ContainerEntity[];

    // Deezer playlist/album ID parameters
    id: string;
    listType: string = "playlist";
    currentAlbumInput: ContainerEntity;
    currentPlaylistInput: ContainerEntity;
    currentContainer: ContainerEntity;

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
            {name: "ANTI par TROLL", id:"12279700"},
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
        private _deezerParsingService: DeezerParsingService,
        private _alertService: AlertService,
        private authService: AuthenticationService
    )
    {}

    ngOnInit() {

        this.updateExempleInput(this.listType);
        this.getAlbums();
        this.getPLaylists();
        if(!this.authService.currentUser.account){
            this._alertService.pushAlert({
                type: 'warning',
                message: 'Require deezer auth to fetch user playlist and albums',
                dismissible: true
            });
        }
    }

    fetchTracks(){
        this.getTracks();
    }

    getTracks(){
        // Deezer IMPL
        if(this.id) {
            if(this.listType){
                let obs = this._service.getTracksByType(this.id.toString(),this.listType);
                obs.subscribe(
                    result => {
                        this.dzTrackList = this._deezerParsingService.handleJsonTracks(result);
                    },
                     error => {

                     }
                );
            }
        }
    }

    getPLaylists(){
        if(this.authService.currentUser.account && this.authService.currentUser.account.user_id){
            let obs = this._service.getDeezerPlaylists(this.authService.currentUser.account.user_id.toString());
            obs.subscribe(
                result => {
                    this.dzAlbums = this._deezerParsingService.handleJsonContainer(result,"playlist");
                },
                error => {

                }
            );
        }else {

        }
    }

    getAlbums(){
        if(this.authService.currentUser.account && this.authService.currentUser.account.user_id){
            let obs = this._service.getDeezerAlbums(this.authService.currentUser.account.user_id.toString());
            obs.subscribe(
                result => {
                    this.dzPlaylists = this._deezerParsingService.handleJsonContainer(result,"album");;
                },
                error => {

                }
            );
        }
    }

    updateExempleInput(event){
        if (event == "playlist"){
            this.exempleByType = this.exemplesList[0];
        }
        else if(event == "album") {
            this.exempleByType = this.exemplesList[1];
        }
    }

    updateContainerInput(event){
        console.log(event);
        console.log(event.id);
        console.log(event.type);
        if (event){
            this.currentContainer=event;
            this.id = event.id;
            this.listType = event.type;
        }
        console.log(this.currentContainer);
        console.log(this.id);
        console.log(this.listType);
    }
}
