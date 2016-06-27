import {Injectable,OnInit} from "angular2/core";

import {TrackEntity} from "../entities/track.entity";
import {DeezerAPIService} from "../deezer/deezer-API.service";

@Injectable()
export class TracksService {
    json:any;
    
    constructor(
        private _deezerAPIService: DeezerAPIService
    ) { }

    getTracksByType(id: string,containerType: string){
        return this._deezerAPIService.getTracks(containerType,id);
    }

    getDeezerAlbums(id:string, dzIndex){
        return this._deezerAPIService.getAlbums(id, dzIndex);
    }

    getDeezerPlaylists(id:string){
        return this._deezerAPIService.getPlaylists(id);
    }

}