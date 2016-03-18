import {Injectable,OnInit} from "angular2/core";

import {Track} from "../entities/track.entity";
import {DeezerAPIService} from "../deezer/deezerAPI.service";

@Injectable()
export class TracksService {
    list:Track[];
    
    constructor(
        private _deezerAPIService: DeezerAPIService
    ) { }

    getTracksByType(id: string,containerType: string){
        this.list = this._deezerAPIService.getJson(containerType,id);
        return this.list;
    }

}