import {Pipe, PipeTransform} from 'angular2/core';
import {Relevance, YoutubeOrderBy, VideoDefinition} from './youtube-search.service';

@Pipe({name: 'relevanceLabel'})
export class RelevancePipe implements PipeTransform {
    transform(value:Relevance, args: any[]) : string {
        switch (value) {
            case Relevance.FULLMATCH:
                return 'Perfect';
            case Relevance.HIGH:
                return 'High';
            case Relevance.LOW:
                return 'Low';
            default:
                return 'Bad';
        }
    }
}

@Pipe({name: 'youtubeOrderLabel'})
export class YoutubeOrderPipe implements PipeTransform {
    transform(value:YoutubeOrderBy, args: any[]) : string {
        switch (value) {
            case YoutubeOrderBy.DATE:
                return 'Date (latest)';
            case YoutubeOrderBy.RATING:
                return 'Rating';
            case YoutubeOrderBy.RELEVANCE:
                return 'Relevance';
            default:
                return 'View count';
        }
    }
}

@Pipe({name: 'videoDefinitionLabel'})
export class VideoDefinitionPipe implements PipeTransform {
    transform(value:VideoDefinition, args: any[]) : string {
        switch (value) {
            case VideoDefinition.HD:
                return 'HD';
            case VideoDefinition.SD:
                return 'SD';
            default:
                return '';
        }
    }
}

