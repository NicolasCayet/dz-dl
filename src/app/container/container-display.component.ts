import {Component} from 'angular2/core';
import {TrackEntity} from '../entities/track.entity'
import {ContainerEntity} from "../entities/container.entity";

@Component({
    selector: 'my-container-display',
    templateUrl: 'app/tracks/tracks-index.component.html',
    styleUrls: ['app/tracks/tracks-index.component.css'],
    inputs: ['container']
})
export class ContainerDisplayComponent {
    container: ContainerEntity;
}



