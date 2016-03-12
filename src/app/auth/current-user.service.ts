import {Injectable} from 'angular2/core';
import {CurrentUserEntity} from './current-user.entity';

const REMEMBERED_ID_KEY = 'rememberedId';

@Injectable()
export class CurrentUserService {
    private fakeUser: CurrentUserEntity = {
        id: 1,
        nickname: 'toto',
        picture_small: null
    };

    getById(id: number): Promise<CurrentUserEntity> {
        return new Promise((resolve, reject) => {
            if (id == this.fakeUser.id) {
                resolve(this.fakeUser);
            } else {
                reject(null);
            }
        });
    }

    getByNickname(nickname: string): Promise<CurrentUserEntity> {
        return new Promise((resolve, reject) => {
            if (nickname == this.fakeUser.nickname) {
                resolve(this.fakeUser);
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
}
