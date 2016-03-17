import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Injectable,OnInit} from "angular2/core";

@Injectable()
export class DeezerAPIService {

    baseUri: string = "https://api.deezer.com/";
    jsonString: string;

    constructor(
        public http: Http
    ) { }

    getJson(type:string,id:string){
        let uri = this.buildUri(type,id);
        this.getHttp(uri);
        return this.jsonString;
    }

    //Exemples
    // https://api.deezer.com/playlist/908622995
    // https://api.deezer.com/album/302127
    buildUri(type:string, id:string) {
        return this.baseUri + type + "/" + id;
    }

    getHttp(uri:string){
            this.http.get(uri).subscribe(json => this.jsonString = JSON.stringify(json));
    }
}
