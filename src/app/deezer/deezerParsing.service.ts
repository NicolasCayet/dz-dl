import {Injectable} from "angular2/core";
import {JSONplaylist,JSONalbum} from '../mock/mock-deezerAPI'
import {Track} from "../entities/track";

@Injectable()
export class DeezerParsingService {

    trackList:Track[] = [];

    getPlaylist(id:string) {
        // TODO need to call deezerAPIService to get the JSON instead of the mocked data
        this.handleJsonTracks(JSON.stringify(JSONplaylist));
        return this.trackList;
    }

    getAlbum(id:string) {
        // TODO need to call deezerAPIService to get the JSON instead of the mocked data
        this.handleJsonTracks(JSON.stringify(JSONalbum));
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