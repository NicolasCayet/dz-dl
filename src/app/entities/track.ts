export class Track {
    constructor(public id, public title, public duration, public artistName) {
        this.id = id;
        this.title = title;
        this.duration = duration;
        this.artistName = artistName;
    }
}