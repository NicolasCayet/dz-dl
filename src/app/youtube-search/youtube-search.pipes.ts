import {Pipe, PipeTransform} from 'angular2/core';
import {Relevance} from './youtube-search.service';

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