import {Injectable} from "angular2/core";
import {JSONplaylist,JSONalbum} from '../mock/mock-deezerAPI'
import {Track} from "../entities/track";
import {DeezerAPIService} from '../deezer/deezerAPI.service'

@Injectable()
export class DeezerParsingService {

    trackList:Track[] = [];
    json:any;
    constructor(
        private _deezerAPIService: DeezerAPIService
    ) { }

    getTracksByType(id:string,containerType: string) {
        this.json = this._deezerAPIService.getJson(containerType,id);
        this.handleJsonTracks(this.json);

        // MOCK
        //this.handleJsonTracks(JSON.stringify(JSONplaylist));
        return this.trackList;
    }

    handleJsonTracks(json:string) {

        let data = JSON.parse(json).tracks;
        let jsonTrack;

        // To reset the list for not adding witch each fetching
        this.trackList = [];
        for (let i = 0; i < data["data"].length; i++) {
            jsonTrack = data["data"][i];
            this.trackList.push(new Track(jsonTrack.id,jsonTrack.title,jsonTrack.duration,jsonTrack["artist"].name));
        }
    }

}