import {Component, OnInit} from 'angular2/core';
import {AuthenticationService} from '../auth/authentication.service';
import {Router} from 'angular2/router';

@Component({
    selector: 'login',
    templateUrl: 'app/auth/login.component.html'
})
export class LoginComponent implements OnInit{

    constructor(private _authService: AuthenticationService, router: Router) {
        /*if (_authService.isLoggedIn()) {
            router.navigateByUrl(router.lastNavigationAttempt);
        }*/
    }

    onLoginClick() {
        DZ.login(function(response) {
            console.dir(response);
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                DZ.api('/user/me', function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {perms: 'basic_access,email'});
    }

    ngOnInit() {
        DZ.init({
            appId: this._authService.clientId,
            channelUrl: location.origin + '/deezer-channel-jsonp.html'
        });
    }
}
