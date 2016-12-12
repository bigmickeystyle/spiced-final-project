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
var funcs = require('funcs');
var getSpotify = require('getSpotify');

var timer;
var zIndex = 0;
var player;
var nowLoaded = false;
var percent = 0;
var options = ['Search', 'Spotify', 'Youtube', 'Lyrics', 'Live', 'News', 'Recent', 'Playlist'];
var videoProgress;

var optionsMap = {
    'search-bar': 'search',
    'spotify-results': 'spotify',
    'lyrics-pane': 'lyrics',
    'news-pane': 'news',
    'scrobble-pane': 'recent',
    'artist-results': 'artist',
    'album-results': 'album',
    'tracks-pane': 'tracks',
    'playlist-pane': 'playlist',
    'live-pane': 'live',
    'options': 'options',
    'controls': 'controls',
    'youtube-pane': 'youtube',
    'progress-bar': 'progress'
};



var Player = React.createClass({

    getInitialState: function(){
        return {
            optionsPane: {
                open: true,
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
            artistPane: {
                open: false,
                locked: false
            },
            albumPane: {
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
                open: true,
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
            username: 'braveshave',
            playlist: [],
            paused: false,
            youtubeEnabled: true,
            progress: 0
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
        clearTimeout(timer);
        zIndex += 1;
        if(!this.state[`${optionsMap[pane]}Pane`].locked){
            $(`#${pane}`).css({border: '5px white solid', zIndex: zIndex});
        }
        $(`#${pane}-x`).css({display: 'block', zIndex: zIndex + 1});
        $(`#${pane}Arrow`).css({display: 'block', zIndex: zIndex + 1});
        $(`#${pane}-lock`).css({display: 'block', zIndex: zIndex + 1});
    },

    unhighlight: function(pane){
        zIndex += 0;
        if(!this.state[`${optionsMap[pane]}Pane`].locked){
            $(`#${pane}`).css({border: 'none'});
        }
        timer = setTimeout(function(){
            $(`#${pane}-x`).css({display: 'none'});
            $(`#${pane}Arrow`).css({display: 'none'});
            $(`#${pane}-lock`).css({display: 'none'});
        }, 500);

    },

    sizeHighlight: function(pane){
        clearTimeout(timer);
        $(`#${pane}`).css({border: '5px white dashed'});
        $(`#${pane}Arrow`).css({display: 'block'});
    },

    sizeUnhighlight: function(pane){
        $(`#${pane}`).css({border: 'none'});
        $(`#${pane}Arrow`).css({display: 'none'});
    },

    xHighlight: function(pane){
        clearTimeout(timer);
        $(`#${pane}`).css({border: '5px red solid'});
        $(`#${pane}-x`).css({display: 'block'});
    },

    xUnhighlight: function(pane){
        $(`#${pane}`).css({border: 'none'});
        $(`#${pane}-x`).css({display: 'none'});
    },

    lockHighlight: function(pane){
        clearTimeout(timer);
        $(`#${pane}`).css({border: '5px blue solid'});
        $(`#${pane}-lock`).css({display: 'block'});
    },

    lockUnhighlight: function(pane){
        if(!this.state[`${optionsMap[pane]}Pane`].locked){
            $(`#${optionsMap[pane]}`).css({border: 'none'});
        }
        $(`#${optionsMap[pane]}-lock`).css({display: 'none'});
    },

    closePane: function(pane) {
        funcs.toggleOptions(optionsMap[pane], this);
    },

    lockPane: function(pane) {
        funcs.toggleLock(optionsMap[pane], this, pane);
    },

    move: function(pane, eventStart) {
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
        if (artist == this.state.currentArtist && this.state.artistPane){
            console.log("currentArtist");
            return;
        }
        this.setState({
            isLoadingArtists: true,
            artistPane: {
                open: true,
                locked: false
            }
        });
        var thisState = this;
        getSpotify.searchArtist(artist).then(function(artists){
            thisState.setState({
                currentArtist: artist,
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
            artistPane: {
                open: true,
                locked: false
            },
            albumPane: {
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
        if (album == this.state.currentAlbum && this.state.albumPane.open){
            console.log("current album");
            return;
        }

        this.setState({
            isLoadingAlbum: true,
            albumPane: {
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
            console.log(albumSpotDetails);
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
        var thisState = this;
        trackResults.forEach(function(albumTrack){
            if (albumTrack['track_number'] == currentTrackNum) {
                getYoutube.getVideo(currentArtist, trackResults[currentTrackNum % trackResults.length].name).then(function(nextTrack){
                    player.loadVideoById(nextTrack[0].id.videoId);
                });
                thisState.setState({
                    currentTrackNum: (currentTrackNum + 1) % trackResults.length
                });
            }
        });
    },

    handlePrevTrack: function(){
        var {trackResults, currentTrackNum, currentArtist} = this.state;
        var thisState = this;
        trackResults.forEach(function(albumTrack){
            if (albumTrack['track_number'] == currentTrackNum) {
                getYoutube.getVideo(currentArtist, trackResults[(currentTrackNum + trackResults.length - 2) % trackResults.length].name).then(function(nextTrack){
                    player.loadVideoById(nextTrack[0].id.videoId);
                });
                thisState.setState({
                    currentTrackNum: (currentTrackNum + trackResults.length - 1) % trackResults.length
                });
            }
        });
    },

    handleNewClickedTrack: function(artist, track, id, num){
        console.log(artist, track);
        var {uri, lyricsPane, trackResults} = this.state;
        var thisState = this;
        if (id == uri){
            console.log("no new track detected");
            return;
        }
        this.setState({
            currentTrack: track,
            currentTrackNum: num,
            playlist: this.state.trackResults.concat(trackResults)
        });
        percent = 0;
        getYoutube.getVideo(artist, track).then(function(videoDetails){
            thisState.setState({
                currentYoutubeResults: videoDetails
            });
            var firstResult = videoDetails[0].id.videoId;
            thisState.state.player.loadVideoById(firstResult);
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
        if(artist == this.state.currentArtist && this.state.albumPane.open) {
            console.log("no new artist selected");
            return;
        }
        var thisState = this;
        thisState.setState({
            albumPane: {
                open: true,
                locked: false
            },
            currentArtist: artist,
            albumsLoading: true,
            newsLoading: true
        });
        bing.getNews(artist).then(function(news){
            thisState.setState({
                newsLoading: false,
                news: news
            });
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
        funcs.toggleOptions(option, this);
    },

    handleNewYoutubeVideo: function(id){
        player.loadVideoById(id);
    },

    handlePlayerStart: function(){
        this.setState({
            player: player
        });
    },

    handlePause: function(){
        if (this.state.paused){
            this.state.player.playVideo();
            this.setState({
                paused: false
            });
        } else {
            this.state.player.pauseVideo();
            this.setState({
                paused: true
            });
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
        this.state.player.seekTo(this.state.currentDuration/100*percent);
    },


    render: function () {
        var {isLoadingArtists, artist, artists, albums, news, uri, trackResults, lyrics, currentYoutubeResults,
            searchPane, spotifyPane, controlsPane, lyricsPane, livePane, newsPane, recentPane, artistPane, albumPane, tracksPane,
            albumLoading, newsLoading, lyricsLoading, playlistPane, youtubePane,
            currentArtist, currentTrack, playlist, youtubeEnabled, progress,
            recentScrobbles, username} = this.state;

        var {handleClickedOption, handleNewClickedAlbum, handleNewClickedTrack, handleNewClickedArtist, handleNewArtist, handleNewAlbum, handleNewTrack, handleScrobbles,
            handleNextTrack, handlePrevTrack, handleNewLyrics, handleNewYoutubeVideo, handlePause, handlePlayerStart, handleProgress, setDuration, handleProgressChange,
            move, resize, highlight, unhighlight, sizeHighlight, sizeUnhighlight, xHighlight, xUnhighlight, lockHighlight, lockUnhighlight, closePane, lockPane} = this;

        function renderAlbumResults(){
            var albumArray = [];
            var albumNamesArray = [];
            if(albums){
                albums.forEach(function(result){
                    if (albumNamesArray.indexOf(result.name) == -1){
                        albumArray.push(result);
                        albumNamesArray.push(result.name);
                    }
                });
                return (
                    albumArray
                    .map(function(album, i){
                        return <AlbumResults artist={artist} id={album.id} album={album.name} onClickedAlbum={handleNewClickedAlbum} key={i}/>;
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
            if(trackResults) {
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
                    <h2>Searching</h2>
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
                        return <News description={article.description} key={i} />;
                    })
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
            console.log(currentYoutubeResults);
            return currentYoutubeResults.map(function(youtubeResult, i){
                return <YoutubeResults onClickedTrack={handleNewYoutubeVideo} id={youtubeResult.id.videoId} title={youtubeResult.snippet.title} image={youtubeResult.snippet.thumbnails.default.url} key={i}/>;
            });
        }

        function newContainer(key, content, type, top, left, height, width, title){
            var lockLeft = left + 25;
            var arrowLeft = left + width - 20;
            var arrowTop = top + height - 20;
            zIndex = key + 3;
            return <PlayerContainer
                    key={key}
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
                        top: `${top}px`,
                        left: `${left}px`,
                        height: `${height}px`,
                        width: `${width}px`,
                        zIndex: zIndex
                    }}
                    arrowStyle={{
                        left: arrowLeft,
                        top: arrowTop,
                        zIndex: zIndex + 1
                    }}
                    xStyle={{
                        left: left,
                        top: top,
                        zIndex: zIndex + 1
                    }}
                    lockStyle={{
                        left: lockLeft,
                        top: top,
                        zIndex: zIndex + 1
                    }}
                    />;
        }

        function renderYoutube(){
            if (YT.loaded && !nowLoaded) {
                console.log("loading!");
                player = new YT.Player('player', {
                    height: '100%',
                    width: '100%',
                    videoId: 'cJIe5oFPZEw',
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerChange
                    },
                    playerVars: {
                        showinfo: '0',
                        enablejsapi: 1,
                        controls: 0,
                        modestbranding: 1,
                        iv_load_policy: 0,
                        autoplay: 1
                    }
                });
                if (player.h) {
                    console.log(player);
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
                    clearInterval(videoProgress);
                    percent = 0;
                    handleNextTrack();
                }
                if (e.data == 1){
                    handleProgress();
                }
            }
            setTimeout(function(){
                if(!nowLoaded){
                    console.log("rendering");
                    renderYoutube();
                }
            }, 500);
        }

        function renderContainers(){
            var renderArray=[newContainer(0, renderOptions(), 'options', 60, 0, 235, 125, "menu")];
            var renderKey = 1;

            if (controlsPane.open){
                renderArray.push(<Video key={renderKey}/>);
                renderKey++;
                renderArray.push(newContainer(renderKey, <YoutubeControls onPause={handlePause} onNext={handleNextTrack} onPrev={handlePrevTrack}/>, 'controls', 75, 1125, 150, 100));
                renderKey++;
                renderArray.push(newContainer(renderKey, <ProgressBar onProgressClick={handleProgressChange} progress={progress} />, 'progress-bar', 150, 1125, 50, 300));
                renderKey++;
            }
            if(searchPane.open){
                renderArray.push(newContainer(renderKey,
                    <PlayerForm onArtistSubmit={handleNewArtist} onAlbumSubmit={handleNewAlbum} onTrackSubmit={handleNewTrack}/>,
                    'search-bar', 260, 0, 240, 280, "search"));
                renderKey++;
            }
            if (spotifyPane.open) {
                renderArray.push(newContainer(renderKey, renderSpotify(), 'spotify-results', 100, 500, 100, 300, "spotify"));
                renderKey++;
            }
            if (artistPane.open){
                renderArray.push(newContainer(renderKey, renderArtistResults(), 'artist-results', 320, 0, 260, 330, "artists"));
                renderKey++;
            }
            if (albumPane.open){
                renderArray.push(newContainer(renderKey, renderAlbumResults(), 'album-results', 400, 620, 200, 200, "albums"));
                renderKey++;
            }
            if (tracksPane.open){
                renderArray.push(newContainer(renderKey, renderTracks(), 'tracks-pane', 150, 120, 200, 200, "tracks"));
                renderKey++;
            }
            if (lyricsPane.open) {
                renderArray.push(newContainer(renderKey, renderLyrics(), 'lyrics-pane', 300, 420, 200, 200, "lyrics"));
                renderKey++;
            }
            if (recentPane.open) {
                renderArray.push(newContainer(renderKey, renderRecentScrobbles(username), 'scrobble-pane', 350, 520, 200, 200, "recent"));
                renderKey++;
            }
            if (newsPane.open) {
                renderArray.push(newContainer(renderKey, renderNews(), 'news-pane', 450, 720, 200, 200, "news"));
                renderKey++;
            }
            if (livePane.open) {
                renderArray.push(newContainer(renderKey, renderLive(), 'live-pane', 500, 820, 200, 200, "live"));
                renderKey++;
            }
            if (playlistPane.open) {
                renderArray.push(newContainer(renderKey, renderPlaylist(), 'playlist-pane', 550, 920, 200, 200, "playlist"));
                renderKey++;
            }
            if (youtubePane.open) {
                renderArray.push(newContainer(renderKey, renderYoutubeResults(), 'youtube-pane', 350, 350, 200, 200, "youtube"));
                renderKey++;
            } if (youtubeEnabled){
                {renderYoutube();}
            }
            return renderArray;
        }

        return (
            <div>
                {renderContainers()}
            </div>

        );
    }
});

module.exports = Player;
