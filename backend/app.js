var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require('fs');
//var ytdl = require('ytdl-core');
var youtubeStream = require('youtube-audio-stream');
var ffmetadata = require("ffmetadata");
var sanitizeFilename = require('sanitize-filename');

var pathToDlDir = './downloads';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Prepare a container name from its object representation (not sanitized)
 * May throw exception if object is malformed (or its attributes are invalid)
 *
 * @param containerObj Object like
 *  {
 *    title: string,
 *    type: string,
 *    artist_name?: string
 *  }
 * @return string
 */
var buildContainerName = function(containerObj) {
    if (!containerObj.title || !containerObj.type) {
        throw 'container title or container type is missing or invalid';
    }

    var dirName = containerObj.type;
    if (containerObj.type === 'album' && containerObj.artist_name) {
        dirName += '-' + containerObj.artist_name;
    }
    dirName += '-' + containerObj.title;

    return dirName;
};

/**
 * Check if container exists or create it
 *
 * @param req Json object like:
 *  {
 *    container: {
 *      title: string,
 *      type: string,
 *      artist_name?: string
 *    }
 *  }
 * @param res
 * @param next
 */
var createContainer = function(req, res, next) {
    console.log('create container');
    try {
        var reqData = req.body;

        var dirName = buildContainerName(reqData.container);
        dirName = sanitizeFilename(dirName);
        if (!dirName) {
            throw 'invalid directory name (container name is not a valid filename after sanitize)';
        }
        var dirPath = pathToDlDir + '/' + dirName;
        try {
            var dirStats = fs.statSync(dirPath);
            if (!dirStats.isDirectory()) {
                throw dirPath + ' already exists but is not a directory';
            } else {
                res.json({"empty":"response"});
                next();
            }
        } catch (err) {
            fs.mkdir(dirPath, function() {
                res.status(201).json({"empty":"response"});
                next();
            });
        }
    } catch(exception) {
        res.status(500).send(exception);
        next();
    }
};

/**
 * Download the track from Youtube (referenced with a videoId) and add metadata from the JSON request body (ref https://wiki.multimedia.cx/index.php?title=FFmpeg_Metadata)
 * Require to create the container (POST /container) before downloading an audio
 *
 * @param req Json object like:
 *  {
 *    videoId: string,
 *    track: {
 *      artistName: string,
 *      title: string,
 *      numberInAlbum?: number
 *    },
 *    container: {
 *      title: string
 *    },
 *    album?: {
 *      title: string,
 *      artistName?: string,
 *      totalNumber?: number
 *    }
 *  }
 * @param res
 * @param next
 */
var getAudio = function (req, res, next) {
    try {
        var reqData = req.body;
        var videoId = reqData.videoId;
        if (!videoId) {
            throw 'videoId is missing in request\'s JSON body';
        }
        var trackInfo = reqData.track;
        if (!trackInfo) {
            throw 'track info is missing in request\'s JSON body';
        }
        var requestUrl = 'http://youtube.com/watch?v=' + videoId;

        var dirName = buildContainerName(reqData.container);
        dirName = sanitizeFilename(dirName);
        if (!dirName) {
            throw 'invalid directory name (container title is not a valid filename after sanitize)';
        }
        var dirPath = pathToDlDir + '/' + dirName;
        // check container directory exists
        try {
            var dirStats = fs.statSync(dirPath);
            if (!dirStats.isDirectory()) {
                throw dirPath + ' exists but is not a directory';
            }
        } catch (err) {
            throw 'container directory does not exist';
        }

        var fileName = trackInfo.title;
        if (reqData.container.type === 'playlist') {
            fileName = trackInfo.artistName + '-' + fileName;
        }
        fileName = sanitizeFilename(fileName);
        if (!fileName) {
            throw 'invalid filename (track title is not a valid filename after sanitize)';
        }
        var filePath = dirPath + '/' + fileName + '.mp3';
        var data = {
            artist: trackInfo.artistName,
            title: trackInfo.title
        };
        var options = {};
        if (trackInfo.album) {
            data.album = trackInfo.album.title;
            if (trackInfo.album.artistName) {
                data.album_artist = trackInfo.album.artistName;
            }
            if (trackInfo.album.totalNumber && parseInt(trackInfo.numberInAlbum) !== 'NaN') {
                data.track = trackInfo.numberInAlbum + '/' + trackInfo.album.totalNumber;
            }
            /* // does not work with url .... @todo: attach an image for album (after downloading it)
            if (trackInfo.album.coverUrl) {
                options.attachments = [trackInfo.album.coverUrl];
            }*/
        }

        // download the audio file from youtube
        console.log('download audio file from ' + requestUrl);
        youtubeStream(requestUrl)
            .pipe(
            fs.createWriteStream(filePath)
                .on('error', function() {
                    throw 'error while downloading or writing file';
                })
                .on('close', function() {
                    console.log('download completed');
                    // write metadata
                    ffmetadata.write(filePath, data, function(err) {
                        if (err) {
                            // error while write metadata
                            throw 'error while writing metadata';
                        } else {
                            // send success http respons
                            res.json({"empty":"response"});
                            next();
                        }
                    });
                })
        );

    } catch (exception) {
        res.status(500).send(exception);
        next();
    }
};

app.post("/container", createContainer);

app.post("/youtube-audio", getAudio);

/*
app.post("/youtube-video", function (req, res, next) {
    console.log('post detected');
    console.log(req.body);
    res.json({"hello":"world"});

    ytdl('http://www.youtube.com/watch?v=e8LmduieuDY', {filter: 'video'})
        .pipe(fs.createWriteStream('./downloads/video.mp4'));


    next() // pass control to the next handler
});
*/

var server = app.listen(3002, function() {
    console.log("Listening on port %s...", server.address().port);
});