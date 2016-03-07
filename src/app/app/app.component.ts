import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {LoginComponent} from '../auth/login.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {LoggedInRouterOutlet} from './logged-in-outlet.directive';
import {OauthCallbackComponent} from '../auth/oauth-callback.component';
import {AuthService} from '../auth/auth.service';
import {CurrentUserEntity} from '../auth/current-user.entity';

@Component({
    selector: 'deezer-dl-app',
    templateUrl: 'app/app/app.component.html',
    styleUrls: ['app/app/app.component.css'],
    directives: [ROUTER_DIRECTIVES, LoggedInRouterOutlet],
    providers: [ROUTER_PROVIDERS, AuthService]
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
    },
    {
        path: '/oauth-callback',
        name: 'OauthCallback',
        component: OauthCallbackComponent,
        data: {
            isPublic: true
        }
    }
])
export class AppComponent implements OnInit{
    public currentUser: CurrentUserEntity;

    constructor(private _auth: AuthService) {}

    ngOnInit() {
        this.currentUser = this._auth.getCurrentUser();
    }
}
