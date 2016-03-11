import {Injectable} from 'angular2/core';

export interface AlertProperties {
    message: string;
    type?: string; // one of success,info, warning, danger; default to warning
    dismissible?: boolean;
    dismissOnTimeout?: number; // in milliseconds; default to 0
}

/**
 * Allow to print alert messages (warning/success/danger) from anywhere in the app
 */
@Injectable()
export class AlertService {
    // using an indexed array is mandatory, *ngFor only support standard array
    alerts: AlertProperties[] = [];
    // identifierMap maps fixed identifier of an alert to its changeable index in the alerts array pool
    private identifierMap: Map<number, number>;
    private lastIdentifier: number = 0;

    /**
     * Push and render the alert; returns the identifier of the alert in the alerts pool
     * @param alert
     * @returns {number}
     */
    pushAlert(alert: AlertProperties) {
        this.lastIdentifier++;
        this.identifierMap.set(this.lastIdentifier, (this.alerts.push(alert) - 1));
        return this.lastIdentifier;
    }

    /**
     * Remove an alert by its identifier
     * @param number identifier
     */
    removeAlert(identifier: number) {
        if (this.identifierMap.has(identifier)) {
            let indexToDel = this.identifierMap.get(identifier);
            this.identifierMap.delete(identifier);
            this.alerts.splice(indexToDel, 1);
            // then update all indexes in the identifier map
            this.identifierMap.forEach((val, key, map) => {
                if (val > indexToDel) {
                    map.set(key, (val - 1));
                }
            });
        }
    }
}
