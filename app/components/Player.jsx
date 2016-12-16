var React = require('react');
var getLastFM = require('getLastFM');
var getDiscog = require('getDiscog');
var getYoutube = require('getYoutube');
var genius = require('genius');
var bing = require('bing');
var PlayerContainer = require('PlayerContainer');
var PlayerForm = require('PlayerForm');
var AlbumResults = require('AlbumResults');
var PlayerWidget = require('PlayerWidget');
var Tracks = require('Tracks');
var Lyrics = require('Lyrics');
var News = require('News');
var Video = require('Video');
var Playlist = require('Playlist');
var RecentScrobbles = require('RecentScrobbles');
var ArtistResults = require('ArtistResults');
var BubbleOptions = require('BubbleOptions');
var YoutubeControls = require('YoutubeControls');
var YoutubeResults = require('YoutubeResults');
var YoutubeBackground = require('YoutubeBackground');
var ProgressBar = require('ProgressBar');
var SceneryResults = require('SceneryResults');
var Settings = require('Settings');
var funcs = require('funcs');
var getSpotify = require('getSpotify');
var axios = require('axios');

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');


var timer = {};
var zIndex = 3;
var renderedPanes = [];
var player;
var nowLoaded = false;
var percent = 0;
var options = ['Search', 'Spotify', 'Youtube', 'Lyrics', 'Live', 'News', 'Recent', 'Playlist', 'Settings'];
var videoProgress;
var mouseDown = false;

var initialPlaylist = ['cJIe5oFPZEw', 'cO_IFJaWmhA', 'LHQqqM5sr7g', 'ukc-au8UtlQ'];
var initialPlaylistTrack = 0;

var optionsMap = {
    'search-bar': 'search',
    'spotify-results': 'spotify',
    'lyrics-pane': 'lyrics',
    'news-pane': 'news',
    'scrobble-pane': 'recent',
    'artist-results': 'artists',
    'album-results': 'albums',
    'tracks-pane': 'tracks',
    'playlist-pane': 'playlist',
    'live-pane': 'live',
    'options': 'options',
    'controls': 'controls',
    'youtube-pane': 'youtube',
    'progress-bar': 'progress',
    'sceneries-results': 'sceneries',
    'settings-pane': "settings"
};

var paneMap = {};

for (var key in optionsMap){
    paneMap[optionsMap[key]] = key;
}


var Player = React.createClass({

    componentWillMount: function(){
        var thisState = this;
        axios.get('/check').then(function(results){
            if(results.data.state){
                thisState.setState(results.data.state);
            }
            else {
                thisState.setState({
                    optionsPane: {
                        open: true,
                        locked: false
                    },
                    controlsPane: {
                        open: true,
                        locked: false
                    }
                });
            }
        });
    },

    getInitialState: function(){
        console.log("hi");
        return {
            optionsPane: {
                open: false,
                locked: false
            },
            searchPane: {
                open: false,
                locked: false
            },
            spotifyPane: {
                open: false,
                locked: false
            },
            artistsPane: {
                open: false,
                locked: false
            },
            albumsPane: {
                open: false,
                locked: false
            },
            tracksPane: {
                open: false,
                locked: false
            },
            lyricsPane: {
                open: false,
                locked: false
            },
            recentPane: {
                open: false,
                locked: false
            },
            newsPane: {
                open: false,
                locked: false
            },
            livePane: {
                open: false,
                locked: false
            },
            playlistPane: {
                open: false,
                locked: false
            },
            controlsPane: {
                open: false,
                locked: false
            },
            youtubePane: {
                open:false,
                locked: false
            },
            progressPane: {
                open: true,
                locked: false
            },
            sceneriesPane: {
                open: false,
                locked: false
            },
            settingsPane: {
                open: false,
                locked: false
            },
            username: 'braveshave',
            playlist: [],
            paused: false,
            youtubeEnabled: true,
            progress: 0,
            theme: 'default',
            uri: "spotify:album:3ZqqvWwHzoVCxwdsaUaF9z",
            controlsPos: {
                top: 62,
                left: 1204,
                height: 185,
                width: 83
            },
            optionsPos: {
                top: 60,
                left: 0,
                height: 235,
                width: 125
            },
            progressPos: {
                top: 54,
                left: 215,
                height: 33,
                width: 860
            },
            spotifyPos: {
                top: 93,
                left: 130,
                height: 112,
                width: 372
            },
            artistsPos: {
                top: 293,
                left: 42,
                height: 260,
                width: 330
            },
            albumsPos: {
                top: 316,
                left: 93,
                height: 260,
                width: 330
            },
            sceneriesPos: {
                top: 350,
                left: 170,
                height: 260,
                width: 330
            },
            tracksPos: {
                top: 332,
                left: 138,
                height: 260,
                width: 330
            },
            searchPos: {
                top: 273,
                left: 6,
                height: 240,
                width: 280
            },
            lyricsPos: {
                top: 215,
                left: 1090,
                height: 460,
                width: 210
            },
            newsPos: {
                top: 97,
                left: 745,
                height: 571,
                width: 338
            },
            livePos: {
                top: 97,
                left: 503,
                height: 494,
                width: 237
            },
            playlistPos: {
                top: 238,
                left: 263,
                height: 449,
                width: 355
            },
            youtubePos: {
                top: 485,
                left: 4,
                height: 206,
                width: 477
            },
            recentPos: {
                top: 171,
                left: 216,
                height: 206,
                width: 300
            },
            settingsPos: {
                top: 171,
                left: 216,
                height: 206,
                width: 300
            }
        };

    },

    resize: function(pane, eventStart) {
        var startCssWidth = parseInt(($(`#${pane}`).css('width')));
        var startLeft = eventStart.pageX;
        var startCssHeight = parseInt(($(`#${pane}`).css('height')));
        var startTop = eventStart.pageY;
        $(document).on('mousemove.arrowmove', function(e){
            e.preventDefault();
            var movementX = e.pageX;
            var movementY = e.pageY;
            $(`#${pane}`).css({width: movementX - startLeft + startCssWidth, height: movementY - startTop + startCssHeight});
            $(`#${pane}Arrow`).css({top: movementY - 10, left: movementX - 10});
        });
        $(document).on('mouseup.arrowstop', function(){
            $(this).off('.arrowmove');
            $(this).off('.arrowstop');
        });
    },

    highlight: function(pane){
        if(!mouseDown){
            zIndex += 1;
            $(`#${pane}`).css({zIndex: zIndex});
            if(!this.state[`${optionsMap[pane]}Pane`].locked){
                $(`#${pane}`).css({border: '5px white solid'});
            }
            $(`#${pane}-x`).css({display: 'block', zIndex: zIndex + 1});
            $(`#${pane}Arrow`).css({display: 'block', zIndex: zIndex + 1});
            $(`#${pane}-lock`).css({display: 'block', zIndex: zIndex + 1});
        }
        clearTimeout(timer[pane]);
    },

    unhighlight: function(pane){
        if(!this.state[`${optionsMap[pane]}Pane`].locked && !mouseDown){
            $(`#${pane}`).css({border: 'none'});
        }

        timer[pane] = setTimeout(function(){
            $(`#${pane}-x`).css({display: 'none'});
            $(`#${pane}Arrow`).css({display: 'none'});
            $(`#${pane}-lock`).css({display: 'none'});
        }, 500);

    },

    sizeHighlight: function(pane){
        clearTimeout(timer[pane]);
        $(`#${pane}`).css({border: '5px white dashed'});
        $(`#${pane}Arrow`).css({display: 'block'});
    },

    sizeUnhighlight: function(pane){
        $(`#${pane}`).css({border: 'none'});
        timer[pane] = setTimeout(function(){
            $(`#${pane}-x`).css({display: 'none'});
            $(`#${pane}Arrow`).css({display: 'none'});
            $(`#${pane}-lock`).css({display: 'none'});
        }, 500);
    },

    xHighlight: function(pane){
        clearTimeout(timer[pane]);
        $(`#${pane}`).css({border: '5px red solid'});
        $(`#${pane}-x`).css({display: 'block'});
    },

    xUnhighlight: function(pane){
        if(!this.state[`${optionsMap[pane]}Pane`].locked){
            $(`#${pane}`).css({border: 'none'});
        } else if (this.state[`${optionsMap[pane]}Pane`].locked) {
            $(`#${pane}`).css({border: '5px blue solid'});
        }
        timer[pane] = setTimeout(function(){
            $(`#${pane}-x`).css({display: 'none'});
            $(`#${pane}Arrow`).css({display: 'none'});
            $(`#${pane}-lock`).css({display: 'none'});
        }, 500);
    },

    lockHighlight: function(pane){
        clearTimeout(timer[pane]);
        $(`#${pane}`).css({border: '5px blue solid'});
        $(`#${pane}-lock`).css({display: 'block'});
    },

    lockUnhighlight: function(pane){
        if(!this.state[`${optionsMap[pane]}Pane`].locked){
            $(`#${optionsMap[pane]}`).css({border: 'none'});
        }
        timer[pane] = setTimeout(function(){
            $(`#${pane}-x`).css({display: 'none'});
            $(`#${pane}Arrow`).css({display: 'none'});
            $(`#${pane}-lock`).css({display: 'none'});
        }, 500);
    },

    closePane: function(pane) {
        var thisState = this;
        renderedPanes.forEach(function(renderedPane){
            var savePos = {};
            var closedPos = `${renderedPane}Pos`;
            savePos[closedPos] = {
                top: parseInt($(`#${paneMap[renderedPane]}`).css('top')),
                left: parseInt($(`#${paneMap[renderedPane]}`).css('left')),
                height: parseInt($(`#${paneMap[renderedPane]}`).css('height')),
                width: parseInt($(`#${paneMap[renderedPane]}`).css('width'))
            };
            thisState.setState(savePos);
        });
        funcs.toggleOptions(optionsMap[pane], this);
    },

    lockPane: function(pane) {
        funcs.toggleLock(optionsMap[pane], this, pane);
    },

    move: function(pane, eventStart) {
        mouseDown = true;
        if(!this.state[`${optionsMap[pane]}Pane`].locked){
            var startLeft = eventStart.pageX - parseInt($(`#${pane}`).css('left'));
            var startTop = eventStart.pageY - parseInt($(`#${pane}`).css('top'));
            var arrowLeft = eventStart.pageX - parseInt(($(`#${pane}Arrow`).css('left')));
            var arrowTop = eventStart.pageY - parseInt(($(`#${pane}Arrow`).css('top')));
            var xLeft = eventStart.pageX - parseInt(($(`#${pane}-x`).css('left')));
            var xTop = eventStart.pageY - parseInt(($(`#${pane}-x`).css('top')));
            var lockLeft = eventStart.pageX - parseInt(($(`#${pane}-lock`).css('left')));
            var lockTop = eventStart.pageY - parseInt(($(`#${pane}-lock`).css('top')));
            $(document).on('mousemove.boxmove', function(e){
                e.preventDefault();
                $(`#${pane}`).css({left: e.pageX - startLeft, top: e.pageY - startTop});
                $(`#${pane}Arrow`).css({left: e.pageX - arrowLeft, top: e.pageY - arrowTop});
                $(`#${pane}-x`).css({left: e.pageX - xLeft, top: e.pageY - xTop});
                $(`#${pane}-lock`).css({left: e.pageX - lockLeft, top: e.pageY - lockTop});
            });
            $(document).on('mouseup.boxstop', function(){
                mouseDown = false;
                $(this).off('.boxmove');
                $(this).off('.boxstop');
            });
        }
    },

    componentWillReceiveProps: function (newProps) {
        if(newProps.location){
            var searchVal = newProps.location.query.search;
            if (searchVal) {
                this.handleNewSearch(searchVal);
                window.location.hash = '#/';
            }
        }
    },

    handleNewArtist: function (artist) {
        if (artist == this.state.currentArtist && this.state.artistsPane){
            console.log("currentArtist");
            return;
        }
        this.setState({
            isLoadingArtists: true,
            artistsPane: {
                open: true,
                locked: false
            }
        });
        var thisState = this;
        getSpotify.searchArtist(artist).then(function(artists){
            thisState.setState({
                isLoadingArtists: false,
                artists: artists
            });
        }).catch(function(err){
            console.log(err);
            thisState.setState({
                isLoadingArtists: false,
                artist: artist,
                artists: 'apologies, no album found for this artist'
            });
        });
    },

    handleNewSearch: function(string) {
        this.setState({
            isLoadingArtists: true,
            isLoadingAlbum: true,
            isLoadingTracks: true,
            artistsPane: {
                open: true,
                locked: false
            },
            albumsPane: {
                open: true,
                locked: false
            },
            tracksPane: {
                open: true,
                locked: false
            }
        });
        var thisState = this;
        getSpotify.searchAll(string).then(function(results){
            console.log(results);
            thisState.setState({
                isLoadingArtists: false,
                isLoadingAlbum: false,
                isLoadingTracks: false,
                albums: results.albums.items,
                trackResults: results.tracks.items,
                artists: results.artists.items
            });
        }).catch(function(err){
            console.log(err);
        });

    },

    handleNewAlbum: function(album) {
        if (album == this.state.currentAlbum && this.state.albumsPane.open){
            console.log("current album");
            return;
        }

        this.setState({
            isLoadingAlbum: true,
            albumsPane: {
                open: true,
                locked: false
            }
        });
        var thisState = this;
        getSpotify.searchAlbum(album).then(function(albums){
            thisState.setState({
                currentAlbum: album,
                isLoadingAlbum: false,
                albums: albums
            });
        }).catch(function(err){
            console.log(err);
            thisState.setState({
                isLoadingAlbum: false,
                albums: "apologies, no albums found"
            });
        });

    },

    handleNewTrack: function(track) {
        if (track == this.state.currentTrack && this.state.tracksPane.open){
            console.log("current track");
            return;
        }

        this.setState({
            lyrics: false,
            isLoadingTracks: true,
            tracksPane: {
                open: true,
                locked: false
            }
        });
        var thisState = this;
        getSpotify.searchTrack(track).then(function(tracks){
            thisState.setState({
                currentTrack: track,
                isLoadingTracks: false,
                trackResults: tracks
            });
        }).catch(function(err){
            console.log(err);
            thisState.setState({
                isLoadingTracks: false,
                albums: "apologies, no tracks found"
            });
        });
    },

    handleNewScenery: function(scenery) {
        var thisState = this;
        this.setState({
            isLoadingSceneries: true,
            sceneriesPane: {
                open: true,
                locked: false
            }
        });
        if(scenery == this.state.currentScenery){
            console.log("current scenery");
            return;
        }
        getYoutube.searchScenery(scenery).then(function(sceneries){
            thisState.setState({
                sceneries: sceneries,
                isLoadingSceneries: false
            });
            console.log(sceneries);
        }).catch(function(err){
            console.log(err);
        });
    },

    handleNewClickedAlbum: function (id) {
        if (id == this.state.currrentAlbumId && this.state.tracksPane.open){
            console.log("no change in album");
            return;
        }
        var thisState = this;
        thisState.setState({
            albumLoading: true,
            tracksPane: {
                open: true,
                locked: false
            }
        });
        getSpotify.getAlbum(id).then(function(albumSpotDetails){
            thisState.setState({
                currentArtist: albumSpotDetails.artists[0].name,
                albumLoading: false,
                trackResults: albumSpotDetails.tracks.items,
                currentAlbumId: id,
                uri: albumSpotDetails.uri
            });
        });
    },

    handleNextTrack: function(){
        var {trackResults, currentTrackNum, currentArtist} = this.state;
        percent = 0;
        clearInterval(videoProgress);
        $('#progress-bar-title').css({width: '0%'});
        if (trackResults) {
            var thisState = this;
            trackResults.forEach(function(albumTrack){
                if (albumTrack['track_number'] == currentTrackNum) {
                    getYoutube.getVideo(currentArtist, trackResults[currentTrackNum % trackResults.length].name).then(function(videoDetails){
                        player.loadVideoById(videoDetails[0].id.videoId);
                        console.log(trackResults[currentTrackNum % trackResults.length].name);
                        thisState.setState({
                            currentTrackNum: (currentTrackNum + 1) % trackResults.length,
                            currentTrack: trackResults[currentTrackNum % trackResults.length].name,
                            lyrics: false,
                            currentYoutubeResults: videoDetails
                        });
                    });
                }
            });
        } else if (initialPlaylist){
            initialPlaylistTrack += 1;
            if (initialPlaylistTrack == initialPlaylist.length) {
                initialPlaylistTrack = 0;
            }
            player.loadVideoById(initialPlaylist[initialPlaylistTrack]);
        } else {
            player.loadVideoById("DLzxrzFCyOs");
        }
    },

    handlePrevTrack: function(){
        percent = 0;
        clearInterval(videoProgress);
        $('#progress-bar-title').css({width: '0%'});
        var {trackResults, currentTrackNum, currentArtist} = this.state;
        var thisState = this;
        if (trackResults){
            trackResults.forEach(function(albumTrack){
                if (albumTrack['track_number'] == currentTrackNum) {
                    getYoutube.getVideo(currentArtist, trackResults[(currentTrackNum + trackResults.length - 2) % trackResults.length].name).then(function(videoDetails){
                        player.loadVideoById(videoDetails[0].id.videoId);
                        thisState.setState({
                            currentTrackNum: (currentTrackNum + trackResults.length - 1) % trackResults.length,
                            currentTrack: trackResults[currentTrackNum % trackResults.length].name,
                            lyrics: false,
                            currentYoutubeResults: videoDetails
                        });
                    });
                }
            });
        } else if (initialPlaylist){
            initialPlaylistTrack -= 1;
            if (initialPlaylistTrack < 0) {
                initialPlaylistTrack = initialPlaylist.length - 1;
            }
            player.loadVideoById(initialPlaylist[initialPlaylistTrack]);
        } else {
            player.loadVideoById("DLzxrzFCyOs");
        }

    },

    handleNewClickedTrack: function(artist, track, id, num){
        if (initialPlaylist){
            initialPlaylist = 0;
        }
        var {uri, lyricsPane, trackResults} = this.state;
        var thisState = this;
        if (id == uri){
            console.log("no new track detected");
            return;
        }
        this.setState({
            currentArtist: artist,
            currentTrack: track,
            currentTrackNum: num,
            playlist: this.state.trackResults.concat(trackResults)
        });
        percent = 0;
        $('#progress-bar-title').css({width: '0%'});
        getYoutube.getVideo(artist, track).then(function(videoDetails){
            thisState.setState({
                currentYoutubeResults: videoDetails
            });
            var firstResult = videoDetails[0].id.videoId;
            player.loadVideoById(firstResult);
        });
        if (lyricsPane.open){
            thisState.handleNewLyrics(artist, track);
        }
    },

    handleNewLyrics: function(artist, track) {
        var thisState = this;
        this.setState({
            lyricsLoading: true
        });
        genius.getSong(artist, track).then(function(lyrics){
            thisState.setState({
                lyrics: lyrics,
                lyricsLoading: false
            });

        });
    },

    handleNewClickedArtist: function (artist, id) {
        if(artist == this.state.currentArtist && this.state.albumsPane.open) {
            console.log("no new artist selected");
            return;
        }
        console.log("hello");
        var thisState = this;
        thisState.setState({
            albumsPane: {
                open: true,
                locked: false
            },
            currentArtist: artist,
            albumsLoading: true,
            news: false
        });
        getSpotify.getAlbums(id).then(function(albums){
            thisState.setState({
                albumsLoading: false,
                albums: albums
            });
        });
    },

    handleScrobbles: function(username){
        var thisState = this;
        getLastFM.getCurrentTracks(username).then(function(tracks){
            thisState.setState({
                recentScrobbles: tracks
            });
        });
    },

    handleClickedOption: function(option){
        option = option.toLowerCase();
        var thisState = this;
        renderedPanes.forEach(function(renderedPane){
            var savePos = {};
            var closedPos = `${renderedPane}Pos`;
            savePos[closedPos] = {
                top: parseInt($(`#${paneMap[renderedPane]}`).css('top')),
                left: parseInt($(`#${paneMap[renderedPane]}`).css('left')),
                height: parseInt($(`#${paneMap[renderedPane]}`).css('height')),
                width: parseInt($(`#${paneMap[renderedPane]}`).css('width'))
            };
            thisState.setState(savePos);
        });
        funcs.toggleOptions(option, this);
    },

    handleNewYoutubeVideo: function(id){
        percent = 0;
        clearTimeout(videoProgress);
        $('#progress-bar-title').css({width: '0%'});
        player.loadVideoById(id);
    },

    handlePlayerStart: function(){
        this.setState({
            player: player
        });
    },

    handlePause: function(){
        if (this.state.paused){
            player.playVideo();
            this.setState({
                paused: false
            });
            $('#play-img').attr('src', './images/pause.png');
        } else {
            clearInterval(videoProgress);
            player.pauseVideo();
            this.setState({
                paused: true
            });
            $('#play-img').attr('src', './images/play.png');
        }
    },

    handleProgress: function(){
        videoProgress = setInterval(this.tick, this.state.currentDuration*5);
    },

    setDuration: function(duration){
        if(duration != this.state.currentDuration){
            this.setState({
                currentDuration: duration
            });
            clearInterval(videoProgress);
        }
    },

    tick: function(){
        percent += 0.5;
        $('#progress-bar-title').css({width: `${percent}%`});
    },

    componentDidMount: function (){
        if(this.props.location){
            var searchVal = this.props.location.query.search;
            if (searchVal) {
                this.handleNewSearch(searchVal);
                window.location.hash = '#/';
            }
        }
    },

    handleProgressChange: function (x){
        clearInterval(videoProgress);
        var width = parseInt($('#progress-bar').css('width'));
        percent = Math.floor(x/width*100);
        $('#progress-bar-title').css({'width': x + 5});
        player.seekTo(this.state.currentDuration/100*percent);
        percent += 1;
    },

    handleNewNews: function(artist){
        var thisState = this;
        this.setState({
            newsLoading: true
        });
        bing.getNews(artist).then(function(news){
            thisState.setState({
                newsLoading: false,
                news: news
            });
            console.log(news[0]);
        });
    },

    handleMute: function() {
        if(this.state.muted){
            player.unMute();
            this.setState({muted: false});
            $('#mute-img').attr('src', './images/mute.png');
        } else {
            player.mute();
            this.setState({muted: true});
            $('#mute-img').attr('src', './images/muted.png');
        }
    },

    handleChangedTheme: function (theme) {
        $('.player-container').removeClass(this.state.theme).addClass(theme);
        $('.vertical-title').removeClass(`vertical-${this.state.theme}`).addClass(`vertical-${theme}`);
        this.setState({
            theme: theme
        });
    },

    componentWillUnmount: function (){
        nowLoaded = false;
        clearInterval(videoProgress);
        percent = 0;
    },

    render: function () {
        var {isLoadingArtists, artist, artists, albums, news, uri, trackResults, lyrics, currentYoutubeResults,
            isLoadingAlbum, isLoadingTracks, sceneriesPane, sceneriesPos, sceneries, isLoadingSceneries,
            searchPane, spotifyPane, controlsPane, lyricsPane, livePane, newsPane, recentPane, artistsPane, albumsPane, tracksPane,
            albumLoading, newsLoading, lyricsLoading, playlistPane, youtubePane, settingsPane,
            currentArtist, currentTrack, playlist, youtubeEnabled, progress,
            controlsPos, optionsPos, progressPos, spotifyPos, artistsPos, albumsPos, tracksPos, searchPos, lyricsPos, newsPos, livePos, playlistPos, youtubePos, recentPos,
            settingsPos, recentScrobbles, username, theme} = this.state;

        var {handleClickedOption, handleNewClickedAlbum, handleNewClickedTrack, handleNewClickedArtist, handleNewArtist, handleNewAlbum, handleNewTrack, handleScrobbles,
            handleMute, handleNextTrack, handlePrevTrack, handleNewLyrics, handleNewYoutubeVideo, handlePause, handlePlayerStart, handleProgress, setDuration,
            handleProgressChange, handleNewNews, handleNewScenery, handleChangedTheme,
            move, resize, highlight, unhighlight, sizeHighlight, sizeUnhighlight, xHighlight, xUnhighlight, lockHighlight, lockUnhighlight, closePane, lockPane} = this;

        function renderAlbumResults(){
            var albumArray = [];
            var albumNamesArray = [];
            if(isLoadingAlbum){
                return <h3>Searching</h3>;
            } else if(albums){
                albums.forEach(function(result){
                    if (albumNamesArray.indexOf(result.name) == -1){
                        albumArray.push(result);
                        albumNamesArray.push(result.name);
                    }
                });
                return (
                    albumArray
                    .map(function(album, i){
                        var imgIndex = Math.floor(Math.random() * album.images.length);
                        if (album.images[imgIndex]) {
                            var url = album.images[imgIndex].url;
                        } else {
                            url = "./images/ken.jpg";
                        }
                        return <AlbumResults artist={artist} image={url} id={album.id} album={album.name} onClickedAlbum={handleNewClickedAlbum} key={i}/>;
                    })
                );
            }
        }

        function displayArtists(){
            return (
                artists.map(function(artistResult, i){
                    var imgIndex = Math.floor(Math.random() * artistResult.images.length);
                    if (artistResult.images[imgIndex]) {
                        var url = artistResult.images[imgIndex].url;
                    } else {
                        url = "./images/ken.jpg";
                    }
                    return <ArtistResults image={url} artist={artistResult.name} id={artistResult.id} onClickedArtist={handleNewClickedArtist} key={i}/>;
                })
            );
        }

        function renderArtistResults(){
            if (isLoadingArtists) {
                return (
                    <h2>Searching</h2>
                );
            } else if (artists){
                return (
                    <div>
                        <div className="album-results-container">
                            {displayArtists()}
                        </div>
                    </div>
                );
            }
        }

        function renderSceneryResults(){
            if(isLoadingSceneries) {
                return (
                    <h3>Searching</h3>
                );
            } else if (sceneries){
                return(
                    sceneries.map(function(scenery, i){
                        return <SceneryResults key={i} id={scenery.id.videoId} scenery={scenery.snippet.title} description={scenery.snippet.description} onClickedScenery={handleNewYoutubeVideo}/>;
                    })
                );
            }
        }

        function renderSpotify(){
            if(albumLoading){
                return (
                    <h2>Searching</h2>
                );
            }
            if (uri) {
                return (
                    <PlayerWidget uri={uri}/>
                );
            }
        }

        function renderTracks(){
            if (isLoadingTracks) {
                return (
                    <h3>Searching</h3>
                );
            } else if(trackResults) {
                return(
                    trackResults.map(function(track, i){
                        return <Tracks num={track['track_number']} track={track.name} artist={track.artists[0].name} id={track.uri} onClickedTrack={handleNewClickedTrack} key={i} />;
                    })
                );
            }
        }

        function renderLyrics(){
            if(lyricsLoading) {
                return (
                    <div>Searching</div>
                );
            } else if(lyrics) {
                lyrics = lyrics.split('\n');
                return(
                    lyrics.map(function(line, i){
                        return <Lyrics line={line} key={i} />;
                    })
                );
            } else if(currentTrack && currentArtist){
                handleNewLyrics(currentArtist, currentTrack);
            } else {
                return(
                    <h2>no lyrics available</h2>
                );
            }
        }

        function renderNews(){
            if(newsLoading){
                return (
                    <h2>Searching</h2>
                );
            }
            if (news) {
                return(
                    news.map(function(article, i){
                        if (article.image) {
                            var url = article.image.thumbnail.contentUrl;
                        } else {
                            url = "./images/ken.jpg";
                        }
                        return <News title={article.name} url={article.url} description={article.description} image={url} key={i} />;
                    })
                );
            } else if(currentArtist){
                handleNewNews(currentArtist);
            } else {
                return (
                    <h2>No news available</h2>
                );
            }
        }

        function renderRecentScrobbles(name){
            if (Array.isArray(recentScrobbles)){
                return recentScrobbles.map(function(track, i){
                    return <RecentScrobbles track={track.name} artist={track.artist['#text']} album={track.album['#text']} date={track.date['#text']} user={name} onGenerate={handleScrobbles} key={i}/>;
                });
            } else {
                return <RecentScrobbles user={name} onGenerate={handleScrobbles}/>;
            }

        }

        function renderOptions() {
            return options.map(function(option, i){
                return <BubbleOptions option={option} onClickedOption={handleClickedOption} key={i}/>;
            });
        }

        function renderLive() {
            return <div>TODO</div>;
        }

        function renderPlaylist() {
            return playlist.map(function(track, i){
                return <Playlist num={track['track_number']} track={track.name} artist={track.artists[0].name} id={track.uri} onClickedTrack={handleNewClickedTrack} key={i}/>;
            });
        }

        function renderYoutubeResults() {
            if (currentYoutubeResults){
                return currentYoutubeResults.map(function(youtubeResult, i){
                    return <YoutubeResults onClickedTrack={handleNewYoutubeVideo} id={youtubeResult.id.videoId} title={youtubeResult.snippet.title} image={youtubeResult.snippet.thumbnails.default.url} key={i}/>;
                });
            } else {
                return <p>no results</p>;
            }

        }

        function renderSettings() {
            return <Settings currentTheme={theme} onChange={handleChangedTheme}/>;
        }

        function newContainer(key, content, type, position, title){
            var lockLeft = position.left + 25;
            var arrowLeft = position.left + position.width - 20;
            var arrowTop = position.top + position.height - 20;
            zIndex += 1;
            return <PlayerContainer
                    key={key}
                    theme={theme}
                    content={content}
                    type={type}
                    resize={resize.bind(null, type)}
                    move={move.bind(null, type)}
                    highlight={highlight.bind(null, type)}
                    unhighlight={unhighlight.bind(null, type)}
                    sizeHighlight={sizeHighlight.bind(null, type)}
                    sizeUnhighlight={sizeUnhighlight.bind(null, type)}
                    xHighlight={xHighlight.bind(null, type)}
                    xUnhighlight={xUnhighlight.bind(null, type)}
                    lockHighlight={lockHighlight.bind(null, type)}
                    lockUnhighlight={lockUnhighlight.bind(null, type)}
                    close={closePane.bind(null, type)}
                    lock={lockPane.bind(null, type)}
                    boxTitle={title}
                    containerStyle={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        height: `${position.height}px`,
                        width: `${position.width}px`,
                        zIndex: zIndex
                    }}
                    arrowStyle={{
                        left: arrowLeft,
                        top: arrowTop,
                        zIndex: zIndex + 1
                    }}
                    xStyle={{
                        left: position.left,
                        top: position.top,
                        zIndex: zIndex + 1
                    }}
                    lockStyle={{
                        left: lockLeft,
                        top: position.top,
                        zIndex: zIndex + 1
                    }}
                    />;
        }

        function renderYoutube(){
            if (YT.loaded && !nowLoaded) {
                player = new YT.Player('player', {
                    height: '100%',
                    width: '100%',
                    videoId: initialPlaylist[0],
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerChange
                    },
                    playerVars: {
                        showinfo: '0',
                        enablejsapi: 1,
                        controls: 0,
                        modestbranding: 1,
                        iv_load_policy: 3,
                        autoplay: 1
                    }
                });
                if (player.h) {
                    nowLoaded = true;
                }
            }


            function onPlayerReady() {
                player.playVideo();
                handlePlayerStart();
            }

            function onPlayerChange(e){
                if(player.getDuration()){
                    setDuration(player.getDuration());
                }
                if (e.data == 0){
                    percent = 0;
                    $('#progress-bar-title').css({width: `${percent}%`});
                    clearInterval(videoProgress);
                    if (initialPlaylist){
                        initialPlaylistTrack += 1;
                        player.loadVideoById(initialPlaylist[initialPlaylistTrack]);
                    }
                    else {
                        handleNextTrack();
                    }
                } else if (e.data == 1){
                    handleProgress();
                } else if (e.data == 3) {
                    console.log("buffering");
                    clearInterval(videoProgress);
                }
            }
            setTimeout(function(){
                if(!nowLoaded){
                    renderYoutube();
                }
            }, 500);
        }

        function renderContainers(){
            var renderArray=[];
            var renderKey = 0;
            renderedPanes = [];


            if (controlsPane.open){
                renderArray.push(newContainer(renderKey, renderOptions(), 'options', optionsPos, "menu"));
                renderKey++;
                renderedPanes.push('options');
                renderArray.push(<Video key={renderKey}/>);
                renderKey++;
                renderArray.push(newContainer(renderKey, <YoutubeControls onMute={handleMute} onPause={handlePause} onNext={handleNextTrack} onPrev={handlePrevTrack}/>, 'controls', controlsPos));
                renderKey++;
                renderedPanes.push('controls');
                renderArray.push(newContainer(renderKey, <ProgressBar onProgressClick={handleProgressChange} progress={progress} />, 'progress-bar', progressPos));
                renderKey++;
                renderedPanes.push('progress');
            }
            if(searchPane.open){
                renderArray.push(newContainer(renderKey,
                    <PlayerForm onArtistSubmit={handleNewArtist} onAlbumSubmit={handleNewAlbum} onTrackSubmit={handleNewTrack} onScenerySubmit={handleNewScenery}/>,
                    'search-bar', searchPos, "search"));
                renderKey++;
                renderedPanes.push('search');
            }
            if (spotifyPane.open) {
                renderArray.push(newContainer(renderKey, renderSpotify(), 'spotify-results', spotifyPos, "spotify"));
                renderKey++;
                renderedPanes.push('spotify');
            }
            if (artistsPane.open){
                renderArray.push(newContainer(renderKey, renderArtistResults(), 'artist-results', artistsPos, "artists"));
                renderKey++;
                renderedPanes.push('artists');
            }
            if (albumsPane.open){
                renderArray.push(newContainer(renderKey, renderAlbumResults(), 'album-results', albumsPos, "albums"));
                renderKey++;
                renderedPanes.push('albums');
            }
            if (sceneriesPane.open){
                renderArray.push(newContainer(renderKey, renderSceneryResults(), 'sceneries-results', sceneriesPos, "sceneries"));
                renderKey++;
                renderedPanes.push('sceneries');
            }
            if (tracksPane.open){
                renderArray.push(newContainer(renderKey, renderTracks(), 'tracks-pane', tracksPos, "tracks"));
                renderKey++;
                renderedPanes.push('tracks');
            }
            if (lyricsPane.open) {
                renderArray.push(newContainer(renderKey, renderLyrics(), 'lyrics-pane', lyricsPos, "lyrics"));
                renderKey++;
                renderedPanes.push('lyrics');
            }
            if (recentPane.open) {
                renderArray.push(newContainer(renderKey, renderRecentScrobbles(username), 'scrobble-pane', recentPos, "recent"));
                renderKey++;
                renderedPanes.push('recent');
            }
            if (newsPane.open) {
                renderArray.push(newContainer(renderKey, renderNews(), 'news-pane', newsPos, "news"));
                renderKey++;
                renderedPanes.push('news');
            }
            if (livePane.open) {
                renderArray.push(newContainer(renderKey, renderLive(), 'live-pane', livePos, "live"));
                renderKey++;
                renderedPanes.push('live');
            }
            if (playlistPane.open) {
                renderArray.push(newContainer(renderKey, renderPlaylist(), 'playlist-pane', playlistPos, "playlist"));
                renderKey++;
                renderedPanes.push('playlist');
            }
            if (youtubePane.open) {
                renderArray.push(newContainer(renderKey, renderYoutubeResults(), 'youtube-pane', youtubePos, "youtube"));
                renderKey++;
                renderedPanes.push('youtube');
            }

            if (settingsPane.open) {
                renderArray.push(newContainer(renderKey, renderSettings(), 'settings-pane', settingsPos, "settings"));
                renderKey++;
                renderedPanes.push('settings');
            }

            if (youtubeEnabled){
                {renderYoutube();}
            }

            return renderArray;
        }
        return (
            <div>
                <ReactCSSTransitionGroup
                   transitionName="bubble"
                   transitionEnterTimeout={300}
                   transitionLeaveTimeout={300}>
                   {renderContainers()}
                </ReactCSSTransitionGroup>
            </div>

        );
    }
});

module.exports = Player;
