import {Injectable} from "angular2/core";
import {JSONplaylist,JSONalbum} from '../mock/mock-deezerAPI'
import {Track} from "../entities/track";

@Injectable()
export class DeezerParsingService {

    trackList:Track[] = [];

    getPlaylist(id:string) {
        // TODO need to call deezerAPIService to get the JSON instead of the mocked data
        return this.parseData(JSON.stringify(JSONplaylist));
    }

    getAlbum(id:string) {
        // TODO need to call deezerAPIService to get the JSON instead of the mocked data
        this.parseData(JSON.stringify(JSONalbum));
        return this.trackList;
    }

    parseData(json:string) {
        this.handleJsonTracks(JSON.stringify(JSON.parse(json).tracks));
        return this.trackList;
    }

    handleJsonTracks(partialJSON:string) {
        let data = JSON.parse(partialJSON);
        let jsonTrack;

        // To reset the list for not adding witch each fetching
        this.trackList = [];

        for (let i = 0; i < data["data"].length; i++) {
            jsonTrack = data["data"][i];
            this.trackList.push(new Track(jsonTrack.id,jsonTrack.title,jsonTrack.duration,jsonTrack["artist"].name));
        }
    }

}