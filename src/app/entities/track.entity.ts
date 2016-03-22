import {YoutubeSearchResult} from '../youtube-search/youtube-search.service';

export interface TrackEntity {
    id: number;
    title: string;
    duration: number;
    artistName: string;
    youtubeSearchResults?: YoutubeSearchResult[];
}