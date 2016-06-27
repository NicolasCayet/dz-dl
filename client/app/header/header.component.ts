import {Component} from 'angular2/core';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {AlertService} from '../app/alert.service';
import {AuthenticationService} from '../auth/authentication.service';

@Component({
    selector: 'bo-header',
    templateUrl: 'app/header/header.component.html',
    styleUrls: ['app/header/header.component.css'],
    directives: [ROUTER_DIRECTIVES, DROPDOWN_DIRECTIVES, CORE_DIRECTIVES]
})
export class HeaderComponent {
    constructor(private _router: Router, public authService: AuthenticationService) { }

    loginClick() {
        this._router.navigate(['Login']);
    }

    logoutClick() {
        this.authService.logout();
        this._router.navigate(['Login']);
    }
}
