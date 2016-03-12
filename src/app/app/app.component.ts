import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {LoginComponent} from '../auth/login.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {LoggedInRouterOutlet} from './logged-in-outlet.directive';
import {AuthenticationService} from '../auth/authentication.service';
import {CurrentUserEntity} from '../auth/current-user.entity';
import {AlertService} from './alert.service';
import {Alert} from 'ng2-bootstrap/ng2-bootstrap';
import {ConfigService} from '../common/config.service';
import {HeaderComponent} from '../header/header.component';
import {CurrentUserService} from '../auth/current-user.service';

@Component({
    selector: 'deezer-dl-app',
    templateUrl: 'app/app/app.component.html',
    styleUrls: ['app/app/app.component.css'],
    directives: [
        ROUTER_DIRECTIVES,
        HeaderComponent,
        LoggedInRouterOutlet,
        Alert
    ],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        AuthenticationService,
        ConfigService,
        AlertService,
        CurrentUserService
    ]
})
@RouteConfig([
    {
        path: '/login',
        name: 'Login',
        component: LoginComponent,
        data: {
            isPublic: true
        }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardComponent,
        useAsDefault: true
    }
])
export class AppComponent {
    public currentUser: CurrentUserEntity;

    constructor(
        private _auth: AuthenticationService,
        public alertService: AlertService
    ) { }
}
