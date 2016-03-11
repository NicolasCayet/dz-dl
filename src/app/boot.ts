/// <reference path="../typings/browser.d.ts" />

import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app/app.component';
import {HTTP_PROVIDERS} from 'angular2/http';


// set a token statically (bug issue with Angular2 beta 6 router and hash parameters)
localStorage.setItem('access_token', 'Bearer frC8MZdR0556cdc15cd9ac7LST2gp8c56cdc15cd9b01PgFK2iZ');
localStorage.setItem('access_token_expires_at', ''+1456338718);

bootstrap(AppComponent, [HTTP_PROVIDERS])
  .catch(err => console.error(err));