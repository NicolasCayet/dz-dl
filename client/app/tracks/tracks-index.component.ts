import {Component} from 'angular2/core';
import {TrackEntity} from '../entities/track.entity'
import {YoutubeSearchComponent} from "../youtube-search/youtube-search.component";
import {ContainerEntity} from "../entities/container.entity";
import {YoutubeSearchResult} from "../youtube-search/youtube-search.service";
import {Http, Headers} from "angular2/http";
import {ConfigService} from "../common/config.service";

interface DownloadInformation {
    youtubeResult: YoutubeSearchResult;
    excluded: boolean;
    isSearching: boolean;
    isDownloading: boolean;
    downloaded: boolean;
    downloadError: boolean;
}

@Component({
    selector: 'my-track-index',
    templateUrl: 'app/tracks/tracks-index.component.html',
    styleUrls: ['app/tracks/tracks-index.component.css'],
    directives: [YoutubeSearchComponent],
    inputs: ['trackList', 'container']
})
export class TracksComponent {
    trackList: TrackEntity[];
    container: ContainerEntity;

    selectedResults: DownloadInformation[];
    countReadyToDl = 0;
    searchProcessing = false;
    downloadProcessing = false;

    constructor(private http: Http, private config: ConfigService) { }

    ngOnChanges(changes) {
        if (changes.hasOwnProperty('trackList')) {
            this.selectedResults = [];
            this.countReadyToDl = 0;
            let i;
            for (i in changes.trackList.currentValue) {
                this.selectedResults.push({
                    youtubeResult: null,
                    excluded: false,
                    isSearching: false,
                    isDownloading: false,
                    downloaded: false,
                    downloadError: false
                })
            }
        }
    }

    toggleExcludeTrack(index) {
        if (this.selectedResults[index]) {
            this.selectedResults[index].excluded = !this.selectedResults[index].excluded;
            this.addSelected(index, null);
        }
    }

    addSelected(index, result: YoutubeSearchResult) {
        if (this.selectedResults[index]) {
            if (!this.selectedResults[index].youtubeResult && result) {
                this.countReadyToDl++;
            } else if (this.selectedResults[index].youtubeResult && !result) {
                this.countReadyToDl--;
            }
            this.selectedResults[index].youtubeResult = result;
        }
    }

    isSearching(index, isSearching: boolean) {
        if (this.selectedResults[index]) {
            this.selectedResults[index].isSearching = isSearching;
            if (isSearching) {
                this.searchProcessing = true;
            } else if (!this.selectedResults.find(element => element.isSearching)) {
                this.searchProcessing = false;
            }
        }
    }

    downloadClick() {
        let options = {headers: new Headers({'Content-Type': 'application/json'})};
        let containerReqBody = {
            container: this.container
        };
        // create container
        this.http.post(
            this.config.get('backend.url') + '/container',
            JSON.stringify(containerReqBody),
            options
        ).subscribe((response) => {
            // begin downloading all audios
            for (let i in this.selectedResults) {
                if (this.selectedResults[i].youtubeResult &&
                this.trackList[i]) {
                    let audioReqBody = {
                        videoId: this.selectedResults[i].youtubeResult.videoId,
                        track: this.trackList[i],
                        container: this.container,
                        album: this.trackList[i].album
                    };
                    let request = this.http.post(
                        this.config.get('backend.url') + '/youtube-audio',
                        JSON.stringify(audioReqBody),
                        options
                    );
                    this.selectedResults[i].downloadError = false;
                    this.selectedResults[i].isDownloading = true;
                    this.downloadProcessing = true;
                    request.subscribe(() => {
                        this.addSelected(i, null);
                        this.selectedResults[i].downloaded = true;
                        this.selectedResults[i].isDownloading = false;
                        if (!this.selectedResults.find(element => element.isDownloading)) {
                            this.downloadProcessing = false;
                        }
                    }, () => {
                        this.selectedResults[i].downloadError = true;
                        this.selectedResults[i].isDownloading = false;
                        if (!this.selectedResults.find(element => element.isDownloading)) {
                            this.downloadProcessing = false;
                        }
                    });
                }
            }
        });
    }
}
