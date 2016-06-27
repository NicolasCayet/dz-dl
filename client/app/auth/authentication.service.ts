import {Injectable} from 'angular2/core';
import {CurrentUserEntity} from './current-user.entity';
import {CurrentUserService} from './current-user.service';

@Injectable()
export class AuthenticationService {
    public isLoggedIn: boolean = false;
    public currentUser: CurrentUserEntity;

    constructor (private _currentUserService: CurrentUserService) { }

    /**
     * Verify credentials, load the current user and pass isLoggedIn = true
     * @returns Promise<CurrentUserEntity> Reject the promise if login fails
     */
    loginByCredentials(nickname: string, remember: boolean = false): Promise<CurrentUserEntity> {
        return new Promise((resolve, reject) => {
            this._currentUserService.getByNickname(nickname).then(
                userResolved => {
                    this.isLoggedIn = true;
                    this.currentUser = userResolved;
                    if (remember) {
                        this._currentUserService.rememberHim(this.currentUser);
                    }
                    resolve(userResolved);
                },
                userRejected => {
                    reject();
                }
            );
        })
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this._currentUserService.removeRemembered();
    }

    /**
     * @returns {Promise<CurrentUserEntity>}
     */
    logRememberedUser() {
        return this._currentUserService.getRemembered().then(
            userRemembered => {
                this.isLoggedIn = true;
                this.currentUser = userRemembered;
            }
        );
    }
}
