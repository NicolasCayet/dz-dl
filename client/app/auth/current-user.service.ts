import {Injectable} from 'angular2/core';
import {CurrentUserEntity} from './current-user.entity.ts';

const REMEMBERED_ID_KEY = 'rememberedId';
const SAVED_PROFILE_KEY = 'savedProfile';

@Injectable()
export class CurrentUserService {
    getMockUser(): CurrentUserEntity {
        let user;
        try {
            user = JSON.parse(localStorage.getItem(SAVED_PROFILE_KEY));
        } catch(e) {
            // silent error
        }
        if (!user) {
            user = {
                id: 1,
                nickname: 'toto',
                account:null
            };
            this.update(user).then();
        }
        return user;
    }

    getById(id: number): Promise<CurrentUserEntity> {
        return new Promise((resolve, reject) => {
            if (id == this.getMockUser().id) {
                resolve(this.getMockUser());
            } else {
                reject(null);
            }
        });
    }

    getByNickname(nickname: string): Promise<CurrentUserEntity> {
        return new Promise((resolve, reject) => {
            if (nickname == this.getMockUser().nickname) {
                resolve(this.getMockUser());
            } else {
                reject(null);
            }
        });
    }

    /**
     * Register the CurrentUserEntity in session
     * @param CurrentUserEntity
     */
    rememberHim(currentUser: CurrentUserEntity) {
        localStorage.setItem(REMEMBERED_ID_KEY, '' + currentUser.id);
    }

    /**
     * Returns the CurrentUserEntity remembered in session, or reject promise otherwise
     * @returns {Promise<CurrentUserEntity>}
     */
    getRemembered(): Promise<CurrentUserEntity> {
        let localValue = localStorage.getItem(REMEMBERED_ID_KEY);
        if (!localValue) {
            return new Promise((resolve, reject) => {
                reject(null);
            });
        } else {
            return this.getById(+localValue);
        }
    }

    removeRemembered() {
        localStorage.removeItem(REMEMBERED_ID_KEY)
    }

    /**
     * Persist user data, returns the modified version
     * @param CurrentUserEntity currentUser
     * @returns {Promise<CurrentUserEntity>|Promise}
     */
    update(currentUser: CurrentUserEntity): Promise<CurrentUserEntity> {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem(SAVED_PROFILE_KEY, JSON.stringify(currentUser));
                resolve(currentUser);
            } catch(e) {
                reject(null);
            }
        });
    }
}
