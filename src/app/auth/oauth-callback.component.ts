import {Component} from 'angular2/core';
import {AuthService} from '../auth/auth.service';
import {RouteParams} from 'angular2/router';

@Component({
    selector: 'auth-callback',
    templateUrl: 'app/auth/oauth-callback.component.html'
})
export class OauthCallbackComponent {
    loggedIn: boolean;

    constructor(_params: RouteParams, _authService: AuthService) {
        this.loggedIn = _authService.tryLoginFromImplicit(_params);
    }
}
