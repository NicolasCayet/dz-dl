import {YoutubeSearchResult} from '../youtube-search/youtube-search.service';
import {AlbumEntity} from "./album.entity";

export interface TrackEntity {
    id: number;
    title: string;
    duration: number;
    artistName: string;
    numberInAlbum?: number;
    album?: AlbumEntity;
    youtubeSearchResults?: YoutubeSearchResult[];
}