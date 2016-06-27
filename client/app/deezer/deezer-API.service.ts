import {Injectable,OnInit} from "angular2/core";
import {Observable} from "rxjs/Observable";

@Injectable()
export class DeezerAPIService {
    json: any;

    constructor() {
        DZ.init({
            appId: '173331',
            channelUrl: location.origin + '/deezer-channel-jsonp.html'
        });
    }

    getTracks(type:string, id:string){
        return this.getHttp(this.buildTracksUri(type,id));
    }

    getPlaylists(userId:string){
        return this.getHttp(this.buildContainerUri(userId,"playlists"));
    }

    getAlbums(userId:string, dzIndex: number){
        return this.getHttp(this.buildContainerUri(userId,"albums", dzIndex));
    }

    //Exemples
    // https://api.deezer.com/playlist/908622995
    // https://api.deezer.com/album/302127
    buildTracksUri(type:string, id:string) {
        return type + "/" + id;
    }

    // https://api.deezer.com/user/2529/albums
    // https://api.deezer.com/user/2529/playlists
    buildContainerUri(userId:string,type:string, dzIndex:number = null){
        let uri = "user/"+userId+"/"+type;
        if (dzIndex) {
            uri += '?index='+dzIndex;
        }
        return uri;
    }

    getHttp(uri:string){
        console.log("buildedUIR: "+uri);
        return Observable.create(observer => {
            DZ.api(uri, function(response){
                try {
                    if (response.hasOwnProperty('error')) {
                        console.error(response.error);
                        observer.error(response.error);
                    } else {
                        observer.next(response);
                    }
                } catch (e) {
                    observer.error(e);
                }
            });
        });
    }


}
