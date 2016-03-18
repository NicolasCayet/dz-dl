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

    getJson(type:string,id:string){
        return this.getHttp(this.buildUri(type,id));
    }

    //Exemples
    // https://api.deezer.com/playlist/908622995
    // https://api.deezer.com/album/302127
    buildUri(type:string, id:string) {
        return type + "/" + id;
    }

    getHttp(uri:string){
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
