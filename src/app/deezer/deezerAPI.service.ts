import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Injectable,OnInit} from "angular2/core";
import {AlertService} from '../app/alert.service';

@Injectable()
export class DeezerAPIService {

    baseUri: string = "";
    jsonString: string;

    constructor(
        public http: Http,
        private _alertService: AlertService
    ) {
        DZ.init({
            appId: '173331',
            channelUrl: location.origin + '/deezer-channel-jsonp.html'
        });
    }

    getJson(type:string,id:string){
        let uri = this.buildUri(type,id);
        this.getHttp(uri);

        console.log("*******************");
        console.log(this.jsonString);
        console.log("*******************");
        return this.jsonString;
    }

    //Exemples
    // https://api.deezer.com/playlist/908622995
    // https://api.deezer.com/album/302127
    buildUri(type:string, id:string) {
        return type + "/" + id;
    }

    getHttp(uri:string){

        DZ.api(uri, function(response){

            if (response) {
                this.jsonString = JSON.stringify(response);
                console.log("*******************");
                console.log(JSON.stringify(response));
                console.log("*******************");
            }

        });
    }
}
