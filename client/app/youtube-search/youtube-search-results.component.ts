import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {RelevancePipe, VideoDefinitionPipe} from './youtube-search.pipes';
import {YoutubeSearchResult, Relevance} from './youtube-search.service';
import {isArray} from "angular2/src/facade/lang";
import {TrackEntity} from "../entities/track.entity";
import {Http} from "angular2/http";
import {Headers} from "angular2/http";
import {ConfigService} from "../common/config.service";
import {ContainerEntity} from "../entities/container.entity";

interface ResultDecorators {
    embedYoutubeUrl: string;
    selected: boolean;
}

@Component({
    selector: 'youtube-search-results',
    templateUrl: 'app/youtube-search/youtube-search-results.component.html',
    styles: [`
        .preview img {
            cursor: pointer;
        }
        .search-result {
            border: solid 1px black;
        }
        .search-result.selected {
            border: solid 2px green;
        }
        :host >>> span.relevance-valid {
            background-color: #E3FCE4;
        }
        :host >>> span.relevance-invalid {
            background-color: #FCE3E3;
        }
    `],
    pipes: [RelevancePipe, VideoDefinitionPipe]
})
export class YoutubeSearchResultsComponent {
    @Input() searchResults: YoutubeSearchResult[];
    @Input('track') public track: TrackEntity;
    @Input('container') public container: ContainerEntity;
    @Output('selected') public selectedEvent = new EventEmitter<YoutubeSearchResult>();
    decorators: ResultDecorators[] = [];

    ngOnChanges(changes) {
        if (changes.hasOwnProperty('searchResults')) {
            this.decorators = [];
            let i;
            let bestMatchFound = false;
            let selected = false;
            for (i in changes.searchResults.currentValue) {
                if (changes.searchResults.currentValue[i].relevance === Relevance.FULLMATCH &&
                    !bestMatchFound) {
                    selected = true;
                    bestMatchFound = true;
                    this.selectedEvent.emit(changes.searchResults.currentValue[i]);
                } else {
                    selected = false;
                }
                this.decorators.push({
                    embedYoutubeUrl: null,
                    selected: selected
                });
            }
        }
    }

    selectResult(resultIndex) {
        let selected = this.decorators.find(decorator => {
            return decorator.selected;
        });
        if (selected) {
            selected.selected = false;
        }
        this.decorators[resultIndex].selected = true;
        this.selectedEvent.emit(this.searchResults[resultIndex]);
    }

    toggleYoutubePreview(resultIndex: number, $event) {
        $event.stopPropagation();
        if (this.decorators[resultIndex].embedYoutubeUrl) {
            this.decorators[resultIndex].embedYoutubeUrl = null;
        } else {
            this.decorators[resultIndex].embedYoutubeUrl =
                'https://www.youtube.com/embed/' + this.searchResults[resultIndex].videoId + '?autoplay=true';
        }
    }

    decorateTitleByRelevance(result: YoutubeSearchResult): string {
        let titleReturn = result.title;
        if (result.relevanceResults && isArray(result.relevanceResults.title)) {
            let indexOf;
            let prepend;
            let append = '</span>';
            let newTitle;
            result.relevanceResults.title.forEach(relevance => {
                indexOf = titleReturn.toLowerCase().indexOf(relevance.str.toLowerCase());
                if (indexOf !== -1) {
                    prepend = '<span class="';
                    prepend += relevance.authorizedWord ? 'relevance-valid' : 'relevance-invalid';
                    prepend += '">';
                    newTitle = titleReturn.substring(0, indexOf);
                    newTitle += `${prepend}${titleReturn.substring(indexOf, indexOf + relevance.str.length)}${append}`;
                    newTitle += titleReturn.substring(indexOf + relevance.str.length);
                    titleReturn = newTitle;
                }
            });
        }
        return titleReturn;
    }
}
