import {Injectable,OnInit} from "angular2/core";
import {DeezerParsingService} from './../deezer/deezerParsing.service'
import {Track} from "./track";

@Injectable()
export class TracksService {
    list:Track[];
    
    constructor(
        private _deezerParsingService: DeezerParsingService
    ) { }

    getPlaylist(id: string){
        this.list = this._deezerParsingService.getPlaylist(id);
        return Promise.resolve(this.list);
    }

    getAlbum(id: string){
        this.list =  this._deezerParsingService.getAlbum(id);
        return Promise.resolve(this.list);
    }

}