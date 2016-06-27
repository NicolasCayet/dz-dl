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
import {isNumber} from "angular2/src/facade/lang";

@Component({
    selector: 'my-deezer-form',
    templateUrl: 'app/deezer/deezer-index.component.html',
    styleUrls: ['app/deezer/deezer-index.component.css'],
    viewProviders: [HTTP_PROVIDERS],
    directives: [TracksComponent,ContainerDisplayComponent]
})
export class DeezerIndexComponent implements OnInit {
    dzTrackList: TrackEntity[];
    dzPlaylists: ContainerEntity[] = [];
    dzAlbums: ContainerEntity[] = [];

    // Deezer playlist/album ID parameters
    id: string;
    listType: string = "playlist";
    currentContainer: ContainerEntity;

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
        if (!this.id) {
            return;
        }
        let observer = null;
        if (this.listType === 'album') {
            observer = this._service.getTracksByType(this.id, 'album').subscribe(response => {
                this.currentContainer = this._deezerParsingService.albumsContainerEntity(response);
                this.dzTrackList = this._deezerParsingService.handleJsonTracks(response);
            });
        } else if (this.listType === 'playlist') {
            observer = this._service.getTracksByType(this.id, 'playlist').subscribe(response => {
                this.currentContainer = this._deezerParsingService.playlistsContainerEntitty(response);
                this.dzTrackList = this._deezerParsingService.handleJsonTracks(response);
            });
        }
    }

    getTracks(){
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
                    this.dzPlaylists = this.dzPlaylists.concat(this._deezerParsingService.handleJsonContainer(result,"playlist"));
                },
                error => {

                }
            );
        }else {

        }
    }

    getAlbums(dzAlbumsIndex = null){
        if(this.authService.currentUser.account && this.authService.currentUser.account.user_id){
            let obs = this._service.getDeezerAlbums(this.authService.currentUser.account.user_id.toString(), dzAlbumsIndex);
            obs.subscribe(
                result => {
                    this.dzAlbums = this.dzAlbums.concat(this._deezerParsingService.handleJsonContainer(result,"album"));
                    if (result.hasOwnProperty('next') && result['next']) {
                        let indexParamMatches = result['next'].match(/index=(\d+)/i);
                        if (indexParamMatches.length >= 2 && isNumber(parseInt(indexParamMatches[1]))) {
                            let indexParam = parseInt(indexParamMatches[1]);
                            this.getAlbums(indexParam);
                        }
                    }
                },
                error => {

                }
            );
        }
    }

    updateAlbumInput(event){
        if (event){
            this.currentContainer= this.findContainerByidAndType(event,"album");
            this.id = event;
            this.listType = "album";
            this.getTracks();
        }
    }

    updatePlaylistInput(event){
        if (event){
            this.currentContainer= this.findContainerByidAndType(event,"playlist");
            this.id = event;
            this.listType = "playlist";
            this.fetchTracks();
        }
    }

    findContainerByidAndType(id:string,type:string){
        let list = type == "album" ?  this.dzAlbums : this.dzPlaylists;
        for (let cont of list){
            if(cont.id.toString() == id){
                return cont;
            }
        }
        return null;
    }
}
