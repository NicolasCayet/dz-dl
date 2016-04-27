import {Component} from 'angular2/core';
import {AuthenticationService} from '../auth/authentication.service';
import {Router} from 'angular2/router';
import {DateUtil} from '../common/date.util';
import {AlertService} from '../app/alert.service';
import {AccountEntity} from "../entities/account.entity";
import {ConfigService} from "../common/config.service";

@Component({
    selector: 'login',
    templateUrl: 'app/deezer/deezer-login.component.html'
})
export class DeezerLoginComponent {

    constructor(private _authService: AuthenticationService, private _alertService: AlertService, router: Router, config: ConfigService) {
        DZ.init({
            appId: config.get('deezer.app_id'),
            channelUrl: location.origin + '/deezer-channel-jsonp.html'
        });
    }

    onLoginClick() {
        let typeS = "";
        let msgS = "";
        DZ.login(responseL => {
            console.dir(responseL);
            if (responseL.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                DZ.api('/user/me', response => {

                    let accJson = {
                        "user_id": response.id,
                        "name": response.name,
                        "picture_small": response.picture_small,
                        "picture_medium": response.picture_medium,
                        "picture_big": response.picture_big
                    }
                    this._authService.currentUser.account = accJson;
                    console.log('Good to see you, ' + response.name + '.');

                    if(response && response.name){
                        typeS  = "success";
                        msgS = 'You have been connected to your Deezer account (@' + response.name + ')';
                    }else {
                         typeS = "danger";
                         msgS = 'Connection failure: User cancelled login or did not fully authorize.';
                    }
                });
                localStorage.setItem("access_token", 'Bearer ' + responseL.authResponse.accessToken);
                let expiresAt = DateUtil.timestampSec() + parseInt(responseL.authResponse.expire);
                localStorage.setItem("access_token_expires_at", "" + expiresAt);
            } else {
                console.log('User cancelled login or did not fully authorize.');
                typeS = "danger";
                msgS = 'Connection failure: User cancelled login or did not fully authorize.';
            }
        }, {perms: 'basic_access,email'});

        if(typeS != "" && msgS != ""){
            this._alertService.pushAlert({
                type: typeS,
                message: msgS,
                dismissible: true
            });
        }
    }

}
