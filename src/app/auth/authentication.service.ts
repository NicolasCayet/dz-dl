import {Injectable} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {CurrentUserEntity} from './current-user.entity';
import {Http, Response, RequestOptions, Headers, RequestMethod} from 'angular2/http';
import {DateUtil} from '../common/date.util';

@Injectable()
export class AuthenticationService {
    private accessToken: string;
    private accessTokenExpiresAt: number;
    currentUser: CurrentUserEntity;
    private http: Http;

    private authorizeUrl = 'https://connect.deezer.com/oauth/auth.php';
    clientId = '173331';
    private redirectUri = location.origin + "/oauth-callback";
    defaultScopes: string[] = ['basic_access'];

    constructor(http : Http) {
        this.http = http;

        this.accessToken = localStorage.getItem('access_token');
        let expiresAt = localStorage.getItem('access_token_expires_at');
        if (expiresAt) {
            this.accessTokenExpiresAt = parseInt(expiresAt);
        }
    }

    isLoggedIn() {
        if (this.accessToken && this.accessTokenExpiresAt && this.accessTokenExpiresAt > DateUtil.timestampSec()) {
            console.log('is connected '+this.accessToken+' '+this.accessTokenExpiresAt);
            return true;
        } else {
            console.log('not connected '+this.accessToken+' '+this.accessTokenExpiresAt);
            return false;
        }
    }

    getCurrentUser() {
        if (!this.currentUser && this.isLoggedIn()) {
            this.loadCurrentUser();
        }

        return this.currentUser;
    }

    /**
     * Performs a redirect to the external OAuth login page (implicit flow)
     */
    initImplicitFlow() {
        window.location.href = this.createImplicitFlowUrl(this.defaultScopes);
    }

    /**
     * Process the route parameters (after client has been redirected from implicit flow) and reference it as logged in the application
     *
     * @param RouteParams _params
     * @returns {boolean}
     */
    tryLoginFromImplicit(_params: RouteParams) {
        let accessToken = _params.get('access_token');

        if (!accessToken) {
            return false;
        } else {
            this.accessToken = 'Bearer '+accessToken;
        }

        let expiresIn = parseInt(_params.get('expires'));
        let issuedAt = (Date.now()/1000);
        this.accessTokenExpiresAt = issuedAt + expiresIn;

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("access_token_expires_at", "" + this.accessTokenExpiresAt);

        return true;
    }

    createImplicitFlowUrl(scopes: string[]= this.defaultScopes, state: string = null) {
        let responseType = "token";

        let url = this.authorizeUrl
        + "?response_type="
        + responseType
        + "&app_id="
        + encodeURIComponent(this.clientId)
        + "&redirect_uri="
        + encodeURIComponent(this.redirectUri)
        + "&perms="
        + encodeURIComponent(scopes.join(','));
        if (state) {
            url += "&state="
            + encodeURIComponent(state);
        }

        return url;
    }

    /**
     * Performs request to Deezer API and load the current user profile
     */
    private loadCurrentUser() {
        if (!this.accessToken) {
            return false;
        }

        DZ.api('/user/me', response => {
            console.dir(response);
            this.currentUser = {
                id: response.id,
                name: response.name,
                picture_small: response.picture_small
            }
        });

        return true;
    }
}
