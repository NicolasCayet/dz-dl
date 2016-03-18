import {Injectable,OnInit} from "angular2/core";

import {Track} from "../entities/track.entity";
import {DeezerAPIService} from "../deezer/deezerAPI.service";

@Injectable()
export class TracksService {
    json:any;
    
    constructor(
        private _deezerAPIService: DeezerAPIService
    ) { }

    getTracksByType(id: string,containerType: string){
        return this._deezerAPIService.getJson(containerType,id);
    }

}