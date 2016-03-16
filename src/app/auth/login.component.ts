import {Component} from 'angular2/core';
import {AuthenticationService} from '../auth/authentication.service';
import {Router, RouteParams} from 'angular2/router';
import {DateUtil} from '../common/date.util';
import {AlertService} from '../app/alert.service';
import {CurrentUserEntity} from './current-user.entity';

/**
 * Login a user
 *
 * Query param: redirectUri: where to redirect user if login succeeded
 *
 * Temporary: auto-login a default user
 */
@Component({
    selector: 'login',
    templateUrl: 'app/auth/login.component.html'
})
export class LoginComponent {
    public redirectUri: string;
    public shouldRedirect: boolean = false;
    public rememberMe = false;
    public nickname = 'toto';
    private alertId: number;

    constructor(
        public authService: AuthenticationService,
        private _alertService: AlertService,
        private _params: RouteParams,
        private _router: Router
    ) {
        this._alertService.clean();
        this.redirectUri = _params.get('redirectUri');
        if (!this.redirectUri) {
            this.redirectUri = '/dashboard';
        }
        if (this.authService.isLoggedIn) {
            this._alertService.pushAlert({
                type: 'warning',
                message: 'You are already logged in.',
                dismissible: true,
                dismissOnTimeout: 3000
            });
            this.shouldRedirect = true;
            _router.navigateByUrl(this.redirectUri);
        } else {
            // prevent other alert message already displayed
            if (this.alertId) {
                this._alertService.removeAlert(this.alertId);
            }
            this.alertId = this._alertService.pushAlert({
                type: 'danger',
                message: 'This application requires a login before continuing.',
                dismissible: true
            });
            this.rememberMe = true;
        }
    }

    loginClick() {
        if (this.alertId) {
            this._alertService.removeAlert(this.alertId);
        }
        this.authService.loginByCredentials(this.nickname, this.rememberMe).then(
            currentUser => {
                this._alertService.pushAlert({
                    type: 'success',
                    message: 'Welcome ' + currentUser.nickname,
                    dismissOnTimeout: 3000
                });
                this.shouldRedirect = true;
                this._router.navigateByUrl(this.redirectUri);
            },
            rejected => {
                this.alertId = this._alertService.pushAlert({
                    type: 'danger',
                    message: 'Invalid credentials.',
                    dismissible: true
                });
            }
        );
    }
}
