import {Component, OnInit} from 'angular2/core';
import {AuthService} from '../auth/auth.service';
import {Router} from 'angular2/router';

/// <reference path="../../../typings/custom/deezer/deezer.d.ts" />

@Component({
    selector: 'login',
    templateUrl: 'app/auth/login.component.html'
})
export class LoginComponent implements OnInit{

    constructor(private _authService: AuthService, router: Router) {
        /*if (_authService.isLoggedIn()) {
            router.navigateByUrl(router.lastNavigationAttempt);
        }*/
    }

    onLoginClick() {
        console.log('click login dz');
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
            channelUrl: 'http://deezer-dl.local/channel.html'
        });
    }
}
