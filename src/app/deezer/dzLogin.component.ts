import {Component} from 'angular2/core';
import {AuthenticationService} from '../auth/authentication.service';
import {Router} from 'angular2/router';
import {DateUtil} from '../common/date.util';
import {AlertService} from '../app/alert.service';

@Component({
    selector: 'login',
    templateUrl: 'app/deezer/dzLogin.component.html'
})
export class DzLoginComponent {

    constructor(private _authService: AuthenticationService, private _alertService: AlertService, router: Router) {
        DZ.init({
            appId: '173331',
            channelUrl: location.origin + '/deezer-channel-jsonp.html'
        });
    }

    onLoginClick() {
        DZ.login(function(response) {
            console.dir(response);
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                DZ.api('/user/me', function(response) {
                    this._alertService.pushAlert({
                        type: 'success',
                        message: 'You have been connected to your Deezer account (@' + response.name + ')',
                        dismissible: true
                    });
                    console.log('Good to see you, ' + response.name + '.');
                });
                localStorage.setItem("access_token", 'Bearer ' + response.authResponse.accessToken);
                let expiresAt = DateUtil.timestampSec() + parseInt(response.authResponse.expire);
                localStorage.setItem("access_token_expires_at", "" + expiresAt);
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {perms: 'basic_access,email'});
    }
}
