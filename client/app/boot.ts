/// <reference path="../typings/browser.d.ts" />

import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app/app.component';
import {provide} from 'angular2/core';
import * as configObject from 'config'; // load the config object exported in a module named `config`
// import {DateUtil} from './common/date.util';


// set a token statically (bug issue with Angular2 beta 6 router and hash parameters)
// localStorage.setItem('access_token', 'Bearer frC8MZdR0556cdc15cd9ac7LST2gp8c56cdc15cd9b01PgFK2iZ');
// localStorage.setItem('access_token_expires_at', ''+DateUtil.timestampSec());

bootstrap(AppComponent, [
    provide('config', {useValue: configObject})
]);