import {Injectable,OnInit} from "angular2/core";
import {DeezerParsingService} from './../deezer/deezerParsing.service'
import {Track} from "./track";

@Injectable()
export class TracksService {
    list:Track[];
    
    constructor(
        private _deezerParsingService: DeezerParsingService
    ) { }

    getTracksByType(id: string,containerType: string){
        this.list = this._deezerParsingService.getTracksByType(id,containerType);
        return Promise.resolve(this.list);
    }

}