import {Injectable} from "angular2/core";
import {TrackEntity} from "../entities/track.entity";
import {ContainerEntity} from "../entities/container.entity";

@Injectable()
export class DeezerParsingService {

    trackList:TrackEntity[];
    track: TrackEntity;
    containerList: ContainerEntity[];
    container: ContainerEntity;

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

    handleJsonContainer(json:any,type:string){
        if(json){
            let data = json;
            let jsonContainer;

            // To reset the list for not adding witch each fetching
            this.containerList = [];
            console.log(data["data"]);
            console.log(data["data"].length);
            for (let i = 0; i < data["data"].length; i++) {
                jsonContainer = data["data"][i];
                if(type == "album"){
                    this.container  = this.albumsContainerEntity(jsonContainer);
                }else if(type == "playlist"){
                    this.container = this.playlistsContainerEntitty(jsonContainer);
                }
                this.containerList.push(this.container);
            }
        }
        return this.containerList;
    }

    albumsContainerEntity(jsonContainer:any){
       return {
           id: jsonContainer.id,
           title: jsonContainer.title,
           type: jsonContainer.type,
           picture: jsonContainer.picture,
           picture_small:jsonContainer.picture_small,
           picture_medium:jsonContainer.picture_medium,
           picture_big: jsonContainer.picture_big,
           duration: jsonContainer.duration,
           nb_tracks: jsonContainer.nb_tracks
        }
    }

    playlistsContainerEntitty(jsonContainer:any){
        return {
            id: jsonContainer.id,
            title: jsonContainer.title,
            type: jsonContainer.type,
            picture: jsonContainer.cover,
            picture_small:jsonContainer.cover_small,
            picture_medium:jsonContainer.cover_medium,
            picture_big: jsonContainer.cover_big,
            duration: jsonContainer.duration,
            nb_tracks: jsonContainer.nb_tracks
        }
    }

}

/*

// TODO: REMOVE THIS WHEN DONE

 {
 "data": [
 {
     "id": "1210002701",
     "title": "boutique",
     "duration": 6256,
     "public": true,
     "is_loved_track": false,
     "collaborative": false,
     "rating": 0,
     "nb_tracks": 28,
     "fans": 0,
     "link": "https://www.deezer.com/playlist/1210002701",
     "picture": "https://api.deezer.com/playlist/1210002701/image",
     "picture_small": "https://cdns-images.dzcdn.net/images/cover/4782cc5e4c518d1d9b3a2590e15e4e00-156a2e73244d8fa969cbce6e5bdea8d6-dbb501c41720f138777ae605d485afd0-3351b436d13bc640d0907a84374b10ce/56x56-000000-80-0-0.jpg",
     "picture_medium": "https://cdns-images.dzcdn.net/images/cover/4782cc5e4c518d1d9b3a2590e15e4e00-156a2e73244d8fa969cbce6e5bdea8d6-dbb501c41720f138777ae605d485afd0-3351b436d13bc640d0907a84374b10ce/250x250-000000-80-0-0.jpg",
     "picture_big": "https://cdns-images.dzcdn.net/images/cover/4782cc5e4c518d1d9b3a2590e15e4e00-156a2e73244d8fa969cbce6e5bdea8d6-dbb501c41720f138777ae605d485afd0-3351b436d13bc640d0907a84374b10ce/500x500-000000-80-0-0.jpg",
     "checksum": "648732f62cbdf4ed41d4bde6f122f06c",
     "tracklist": "https://api.deezer.com/playlist/1210002701/tracks",
     "creation_date": "2015-04-18 12:40:11",
     "creator": {
     "id": "1980862",
     "name": "nicocaye",
     "tracklist": "https://api.deezer.com/user/1980862/flow",
     "type": "user"
 },
 "type": "playlist"
 },

 ],
 "checksum": "cee6970a850ef8a6211f3bdf7f6baced40cd750bba9870f18aada2478b24840a",
 "total": 18
 }


 {
 "data": [
 {
 "id": "73601",
 "title": "High Times - The Singles 1992 - 2006",
 "link": "https://www.deezer.com/album/73601",
 "cover": "https://api.deezer.com/album/73601/image",
 "cover_small": "https://cdns-images.dzcdn.net/images/cover/02f44472382552666305baaf6175b547/56x56-000000-80-0-0.jpg",
 "cover_medium": "https://cdns-images.dzcdn.net/images/cover/02f44472382552666305baaf6175b547/250x250-000000-80-0-0.jpg",
 "cover_big": "https://cdns-images.dzcdn.net/images/cover/02f44472382552666305baaf6175b547/500x500-000000-80-0-0.jpg",
 "nb_tracks": 18,
 "release_date": "2006-09-15",
 "record_type": "album",
 "available": true,
 "tracklist": "https://api.deezer.com/album/73601/tracks",
 "explicit_lyrics": false,
 "time_add": 1348005215,
 "artist": {
 "id": "7",
 "name": "Jamiroquai",
 "picture": "https://api.deezer.com/artist/7/image",
 "picture_small": "https://cdns-images.dzcdn.net/images/artist/992b71648c7333f433cb7f13d6e93799/56x56-000000-80-0-0.jpg",
 "picture_medium": "https://cdns-images.dzcdn.net/images/artist/992b71648c7333f433cb7f13d6e93799/250x250-000000-80-0-0.jpg",
 "picture_big": "https://cdns-images.dzcdn.net/images/artist/992b71648c7333f433cb7f13d6e93799/500x500-000000-80-0-0.jpg",
 "tracklist": "https://api.deezer.com/artist/7/top?limit=50",
 "type": "artist"
 },
 "type": "album"
 },
 ],
 "checksum": "5592b7aa5736bab76250bcf161cd3054",
 "total": 93,
 "next": "https://api.deezer.com/user/1980862/albums?index=25"
 }




 */