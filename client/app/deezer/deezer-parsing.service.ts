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
                    "artistName": jsonTrack.artist.name,
                }
                // parse album data
                if (json.type === 'playlist' && jsonTrack.album) {
                    this.track.album = {
                        title: jsonTrack.album.title,
                        coverUrl: jsonTrack.album.cover_medium
                    };
                } else if (json.type === 'album') {
                    this.track.album = {
                        title: json.title,
                        coverUrl: json.cover_medium,
                        totalNumber: json.nb_tracks,
                    };
                    this.track.numberInAlbum = i + 1;
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
            for (let i = 0; i < data["data"].length; i++) {
                jsonContainer = data["data"][i];
                if(type == "album"){
                    this.container = this.albumsContainerEntity(jsonContainer);
                }else if(type == "playlist"){
                    this.container = this.playlistsContainerEntitty(jsonContainer);
                }
                this.containerList.push(this.container);
            }
        }
        return this.containerList;
    }

    playlistsContainerEntitty(jsonContainer:any): ContainerEntity{
       return {
           id: jsonContainer.id,
           title: jsonContainer.title,
           type: jsonContainer.type,
           picture: jsonContainer.picture,
           picture_small:jsonContainer.picture_small,
           picture_medium:jsonContainer.picture_medium,
           picture_big: jsonContainer.picture_big,
           duration: jsonContainer.duration,
           nb_tracks: jsonContainer.nb_tracks,
           artist_name: ""
        }
    }

    albumsContainerEntity(jsonContainer:any): ContainerEntity{
        return {
            id: jsonContainer.id,
            title: jsonContainer.title,
            type: jsonContainer.type,
            picture: jsonContainer.cover,
            picture_small:jsonContainer.cover_small,
            picture_medium:jsonContainer.cover_medium,
            picture_big: jsonContainer.cover_big,
            duration: jsonContainer.duration,
            nb_tracks: jsonContainer.nb_tracks,
            artist_name: jsonContainer.artist.name
        }
    }

}