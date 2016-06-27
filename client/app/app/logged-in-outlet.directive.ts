import {Directive, Attribute, ElementRef, DynamicComponentLoader} from 'angular2/core';
import {Router, RouterOutlet, ComponentInstruction, RouteData} from 'angular2/router';
import {AuthenticationService} from '../auth/authentication.service';
import {LoginComponent} from '../auth/login.component';

/**
 * Analyze if a Route is accessible or if client should be redirected to login page
 *
 * Detect `isPublic` property within `data` property of RouterInstruction
 * Example:
 * @RouteConfig([
 * {
 *     path: '/login',
 *     name: 'Login',
 *     component: LoginComponent,
 *     data: {
 *         isPublic: true
 *     }
 * }
 * ])
 */
@Directive({
    selector: 'router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
    private parentRouter: Router;

    constructor(_elementRef: ElementRef, _loader: DynamicComponentLoader,
                _parentRouter: Router, nameAttr: string, private _authService: AuthenticationService) {
        super(_elementRef, _loader, _parentRouter, nameAttr);

        this.parentRouter = _parentRouter;
    }

    activate(instruction: ComponentInstruction) {
        if (!this._authService.isLoggedIn) {
            this._authService.logRememberedUser().then(
                currentUser => {
                    return super.activate(instruction);
                },
                rejected => {
                    if (!instruction.routeData.get('isPublic') && !this._authService.isLoggedIn) {
                        return super.activate(new ComponentInstruction('Login', [], new RouteData(), LoginComponent, false, '1', {redirectUri: this.parentRouter.lastNavigationAttempt}));
                    }

                    return super.activate(instruction);
                }
            );
        } else {
            return super.activate(instruction);
        }
    }

    routerCanReuse(nextInstruction: ComponentInstruction): Promise<boolean> {
        if (!nextInstruction.routeData.get('isPublic') && !this._authService.isLoggedIn) {
            return new Promise(resolve => resolve(false));
        }

        return super.routerCanReuse(nextInstruction);
    }
}