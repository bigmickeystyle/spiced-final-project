var express = require('express');
var getGenius = require('./app/servercomponents/getGenius');
var getMB = require('./app/servercomponents/getMB');
var getDiscogs = require('./app/servercomponents/getDiscogs')
var dbconnect = require('./app/servercomponents/dbconnect');
var getBingNews = require('./app/servercomponents/getBingNews');
var hash = require('./app/servercomponents/hash');
// Create our app
var app = express();

app.use(require('cookie-parser')());

app.use(require('body-parser').json());

app.get('/check', function (req, res, next){
    if(req.cookies.signedIn){
        res.json({
            state: req.cookies.state,
            settings: "settings"
        });
    } else {
        res.json({
            state: req.cookies.state,
            settings: "none"
        });
    }
    next();
});

app.post('/bye', function(req, res){
    res.cookie('state', req.body);
    console.log(req.cookies.state);
    res.json({
        success: true
    });
});

app.post('/register', function (req, res){
    var query = "INSERT INTO users (username, email_address, password_hash) VALUES ($1, $2, $3)";
    hash.hashPassword(req.body.pwd, function(err, id){
        if (err){
            console.log(err);
        }
        dbconnect(query, [req.body.username || null, req.body.email || null, id]).then(function(){
            req.cookies.username = req.body.username;
            res.json({
                success: true
            });
        }).catch(function(err){
            console.log(err);
        });
    });
});

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
    console.log(req.cookies);
    getBingNews.music(req.query.artist).then(function(response){
        res.json({
            success:true,
            news: response.value
        });
    });
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
