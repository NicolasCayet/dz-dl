import {Injectable,OnInit} from "angular2/core";
import {AlertService} from '../app/alert.service';
import {Observable} from "rxjs/Observable";
import {DeezerParsingService} from "./deezerParsing.service";

@Injectable()
export class DeezerAPIService {
    json: any;

    constructor(
        private _alertService: AlertService,
        private _deezerParsingService: DeezerParsingService
    ) {
        DZ.init({
            appId: '173331',
            channelUrl: location.origin + '/deezer-channel-jsonp.html'
        });
    }

    getJson(type:string,id:string){
        let uri = this.buildUri(type,id);
        let obs = this.getHttp(uri);
        obs.subscribe(
                result => this.json = this._deezerParsingService.handleJsonTracks(result),
                error => {

                }
        );
        return this.json;
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
