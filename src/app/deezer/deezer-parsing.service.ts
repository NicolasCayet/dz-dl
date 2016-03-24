import {Injectable} from "angular2/core";
import {TrackEntity} from "../entities/track.entity";
import {ContainerEntity} from "../entities/container.entity";y.js;
import {WrapperEntity} from "../entities/wrapper.entity";

@Injectable()
export class DeezerParsingService {

    trackList:TrackEntity[];
    track: TrackEntity;
    wrapper: WrapperEntity;
    containerList: ContainerEntity[];
    container: ContainerEntity;

    constructor() {
        this.trackList = [];
    }

    handleJsonTracks(json:any) {

        let container: ContainerEntity;

        if(json){
            let data = json.tracks;
            let jsonTrack;
            let wrappers: WrapperEntity[] = [];

            for (let i = 0; i < data["data"].length; i++) {
                jsonTrack = data["data"][i];

                let track: TrackEntity  = {
                    "id":jsonTrack.id ,
                    "title": jsonTrack.title,
                    "duration":jsonTrack.duration,
                    "artistName": jsonTrack["artist"].name,
                }

                let wrapper: WrapperEntity = {
                    track: track
                }

                wrappers.push(wrapper);
            }

            container = this.builderContainerEntitty(json,wrappers);
        }

        return container;
    }

    handleJsonContainer(json:any,type:string){
        if(json){
            let data = json;
            let jsonContainer;

            // To reset the list for not adding witch each fetching
            this.containerList = [];
            console.log(data["data"]);
            for (let i = 0; i < data["data"].length; i++) {
                jsonContainer = data["data"][i];
                if(type == "album"){
                    this.container  = this.builderContainerEntitty(jsonContainer);
                }else if(type == "playlist"){
                    this.container = this.builderContainerEntitty(jsonContainer);
                }
                this.containerList.push(this.container);
            }
        }
        return this.containerList;
    }

    builderContainerEntitty(jsonContainer:any, wrappers?: WrapperEntity[]){
       return {
           id: jsonContainer.id,
           title: jsonContainer.title,
           type: jsonContainer.type,
           picture: jsonContainer.type == "playlist" ? jsonContainer.picture : jsonContainer.cover,
           picture_small:jsonContainer.type == "playlist" ? jsonContainer.picture_small : jsonContainer.cover_small,
           picture_medium:jsonContainer.type == "playlist" ? jsonContainer.picture_medium : jsonContainer.cover_medium,
           picture_big: jsonContainer.type == "playlist" ? jsonContainer.picture_big : jsonContainer.cover_big,
           duration: jsonContainer.duration,
           nb_tracks: jsonContainer.nb_tracks,
           artist_name: jsonContainer.artist ? jsonContainer.artist.name : "",
           wrappers: wrappers
        }
    }



}
