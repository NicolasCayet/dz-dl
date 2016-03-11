import {Component} from 'angular2/core';
import {AuthenticationService} from '../auth/authentication.service';
import {Router} from 'angular2/router';
import {DateUtil} from '../common/date.util';

@Component({
    selector: 'login',
    templateUrl: 'app/auth/login.component.html'
})
export class LoginComponent {

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
                localStorage.setItem("access_token", 'Bearer ' + response.authResponse.accessToken);
                let expiresAt = DateUtil.timestampSec() + parseInt(response.authResponse.expire);
                localStorage.setItem("access_token_expires_at", "" + expiresAt);
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {perms: 'basic_access,email'});
    }
}
