import {Injectable, Inject} from 'angular2/core';
import * as nestedProperty from 'nested-property';

/**
 * Access to configurations (per environment)
 *
 * Example:
 * configService.get('your.nested.config')
 */
@Injectable()
export class ConfigService {
    constructor(@Inject('config') private _config: Object) {
        if (!_config) {
            throw new Error('Application configurations have not been found and/or cannot be loaded.');
        }
    }

    get(property: string) {
        return nestedProperty.get(this._config, property);
    }
}
