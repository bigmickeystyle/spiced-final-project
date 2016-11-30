var express = require('express');
var getGenius = require('./app/servercomponents/getGenius');

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

app.use(express.static('public'));

app.listen(process.env.PORT || 3000, function () {
    if (process.env.PORT) {
        console.log('hi heroku');
    } else {
        console.log('Express server is up on port 3000');
    }
});
