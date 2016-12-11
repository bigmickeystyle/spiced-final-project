var express = require('express');
var getGenius = require('./app/servercomponents/getGenius');
var getMB = require('./app/servercomponents/getMB');
var getDiscogs = require('./app/servercomponents/getDiscogs')
var dbConnect = require('./app/servercomponents/dbConnect');
var getBingNews = require('./app/servercomponents/getBingNews');
var events = require('events');
var newTrack = Object.create(new events.EventEmitter);
// Create our app
var app = express();

app.get('/lyrics', function(req, res) {
    getGenius.getPath(req.query.artist, req.query.track).then(function(response){
        var url = response.data.response.hits[0].result.url;
        console.log('scraping', url);
        getGenius.getLyrics(url).then(function(lyrics){
            res.json({
                success: true,
                lyrics: lyrics
            });
        });
    }).catch(function(err){
        console.log(err);
    });
});

app.get('/news', function(req, res) {
    console.log("getting news for", req.query.artist);
    getBingNews.music(req.query.artist).then(function(response){
        res.json({
            success:true,
            news: response.value
        });
    });
});

app.get('/nextTrack', function(req, res){
    console.log("getting next track");
    newTrack.emit('newTrack', 'next');
});

app.get('/albums', function(req, res){
    getDiscogs.getAlbums(req.query.artist).then(function(albums){
        res.json({
            sucess: true,
            albums: albums
        });
    });
});

app.use(express.static('public'));

app.listen(process.env.PORT || 3000, function () {
    if (process.env.PORT) {
        console.log('hi heroku');
    } else {
        console.log('Express server is up on port 3000');
    }
});
