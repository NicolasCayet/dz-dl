import {Injectable} from "angular2/core";
import {JSONplaylist,JSONalbum} from '../mock/mock-deezerAPI'
import {Track} from "../entities/track.entity";

@Injectable()
export class DeezerParsingService {

    trackList:Track[];
    json:any;
    track: Track;
    constructor() {
        this.trackList = [];
    }

    handleJsonTracks(json:any) {
        if(json){
            let data = json.tracks;
            let jsonTrack;

            // To reset the list for not adding witch each fetching
            this.trackList = [];
            for (let i = 0; i < data["data"].length; i++) {
                jsonTrack = data["data"][i];
                this.track  = {
                    "id":jsonTrack.id ,
                    "title": jsonTrack.title,
                    "duration":jsonTrack.duration,
                    "artistName": jsonTrack["artist"].name,
                }
                this.trackList.push(this.track);
            }
        }
        return this.trackList;
    }

}