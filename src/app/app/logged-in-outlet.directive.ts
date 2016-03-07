import {Directive, Attribute, ElementRef, DynamicComponentLoader} from 'angular2/core';
import {Router, RouterOutlet, ComponentInstruction} from 'angular2/router';
import {AuthService} from '../auth/auth.service';

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
                _parentRouter: Router, nameAttr: string, private _authService: AuthService) {
        super(_elementRef, _loader, _parentRouter, nameAttr);

        this.parentRouter = _parentRouter;
    }

    activate(instruction: ComponentInstruction) {
        if (!instruction.routeData.get('isPublic') && !this._authService.isLoggedIn()) {
            this.parentRouter.navigate(['Login']);
        }

        return super.activate(instruction);
    }
}