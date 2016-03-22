import {TrackEntity} from "./track.entity";
import {WrapperEntity} from "./wrapper.entity";
export interface ContainerEntity {
    id: number,
    title: string,
    type: string,
    picture?: string,
    picture_small?:string,
    picture_medium?:string,
    picture_big?: string,
    duration?: number,
    nb_tracks: number,
    artist_name?: string
    wrappers?: WrapperEntity[]
}