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
var RecentScrobbles = require('RecentScrobbles');
var ArtistResults = require('ArtistResults');
var BubbleOptions = require('BubbleOptions');
var YoutubeControls = require('YoutubeControls');
var funcs = require('funcs');
var getSpotify = require('getSpotify');



var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var timer;
var zIndex = 0;

var options = ['Search', 'Spotify', 'Youtube', 'Lyrics', 'Live', 'News', 'Recent'];

var optionsMap = {
    'search-bar': 'search',
    'spotify-results': 'spotify',
    'lyrics-pane': 'lyrics',
    'news-pane': 'news',
    'scrobble-pane': 'recent',
    'artist-results': 'artist',
    'album-results': 'album',
    'tracks-pane': 'tracks'
};

var Player = React.createClass({

    getInitialState: function(){
        return {
            searchPaneOpen: false,
            username: 'braveshave',
            youtubeEnabled: true
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
        $(`#${pane}`).css({border: '5px white solid', zIndex: zIndex});
        $(`#${pane}-x`).css({display: 'block', zIndex: zIndex + 1});
        $(`#${pane}Arrow`).css({display: 'block', zIndex: zIndex + 1});
    },

    unhighlight: function(pane){
        zIndex += 0;
        $(`#${pane}`).css({border: 'none'});
        timer = setTimeout(function(){
            $(`#${pane}-x`).css({display: 'none'});
            $(`#${pane}Arrow`).css({display: 'none'});
        }, 500);

    },

    sizeHighlight: function(pane){
        $(`#${pane}`).css({border: '5px white dashed'});
        $(`#${pane}Arrow`).css({display: 'block'});
    },

    sizeUnhighlight: function(pane){
        $(`#${pane}`).css({border: 'none'});
        $(`#${pane}Arrow`).css({display: 'none'});
    },

    xHighlight: function(pane){
        $(`#${pane}`).css({border: '5px red solid'});
        $(`#${pane}-x`).css({display: 'block'});
    },

    xUnhighlight: function(pane){
        $(`#${pane}`).css({border: 'none'});
        $(`#${pane}-x`).css({display: 'none'});
    },

    closePane: function(pane) {
        console.log(pane);
        funcs.toggleOptions(optionsMap[pane], this);
    },

    move: function(pane, eventStart) {
        var startLeft = eventStart.pageX - parseInt($(`#${pane}`).css('left'));
        var startTop = eventStart.pageY - parseInt($(`#${pane}`).css('top'));
        var arrowLeft = eventStart.pageX - parseInt(($(`#${pane}Arrow`).css('left')));
        var arrowTop = eventStart.pageY - parseInt(($(`#${pane}Arrow`).css('top')));
        var xLeft = eventStart.pageX - parseInt(($(`#${pane}-x`).css('left')));
        var xTop = eventStart.pageY - parseInt(($(`#${pane}-x`).css('top')));
        $(document).on('mousemove.boxmove', function(e){
            e.preventDefault();
            $(`#${pane}`).css({left: e.pageX - startLeft, top: e.pageY - startTop});
            $(`#${pane}Arrow`).css({left: e.pageX - arrowLeft, top: e.pageY - arrowTop});
            $(`#${pane}-x`).css({left: e.pageX - xLeft, top: e.pageY - xTop});
        });
        $(document).on('mouseup.boxstop', function(){
            $(this).off('.boxmove');
            $(this).off('.boxstop');
        });
    },

    componentDidMount: function (){
        if(this.props.location){
            var artist = this.props.location.query.artist;
            if (artist) {
                this.handleNewArtist(artist);
                window.location.hash = '#/';
            }
        }
    },

    componentWillReceiveProps: function (newProps) {
        if(newProps.location){
            var artist = newProps.location.query.artist;
            if (artist) {
                this.handleNewArtist(artist);
                window.location.hash = '#/';
            }
        }
    },

    handleNewArtist: function (artist) {
        if (artist == this.state.currentArtist && this.state.artistPaneOpen){
            console.log("currentArtist");
            return;
        }
        this.setState({
            isLoadingArtists: true,
            artistPaneOpen: true
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
                topAlbum: 'apologies, no album found for this artist'
            });
        });
    },

    handleNewAlbum: function(album) {
        console.log(album);
    },

    handleNewTrack: function(track) {
        console.log(track);
    },

    handleNewClickedAlbum: function (id) {
        if (id == this.state.currrentAlbumId && this.state.tracksPaneOpen){
            console.log("no change in album");
            return;
        }
        var thisState = this;
        thisState.setState({
            albumLoading: true,
            tracksPaneOpen: true
        });
        getSpotify.getAlbum(id).then(function(albumSpotDetails){
            thisState.setState({
                albumLoading: false,
                albumTracks: albumSpotDetails.tracks.items,
                currentAlbumId: id
            });
        });
    },

    handleNewClickedTrack: function(artist, track, id){
        var {uri, lyricsPaneOpen} = this.state;
        var thisState = this;
        if (id == uri){
            console.log("no new track detected");
            return;
        }
        this.setState({
            currentTrack: track
        });
        getYoutube.getVideo(artist, track).then(function(videoDetails){
            var firstResult = videoDetails[0].id.videoId;
            player.loadVideoById(firstResult);
        });
        if (lyricsPaneOpen){
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
        if(artist == this.state.currentArtist && this.state.albumPaneOpen) {
            console.log("no new artist selected");
            return;
        }
        var thisState = this;
        thisState.setState({
            albumPaneOpen: true,
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

    render: function () {
        var {isLoadingArtists, artist, artists, albums, news, uri, albumTracks, lyrics,
            searchPaneOpen, spotifyPaneOpen, youtubeEnabled, lyricsPaneOpen, livePaneOpen, newsPaneOpen, recentPaneOpen, artistPaneOpen, albumPaneOpen, tracksPaneOpen,
            albumLoading, newsLoading, lyricsLoading,
            currentArtist, currentTrack,
            recentScrobbles, username} = this.state;

        var {handleClickedOption, handleNewClickedAlbum, handleNewClickedTrack, handleNewClickedArtist, handleNewArtist, handleNewAlbum, handleNewTrack, handleScrobbles, handleNewLyrics,
            move, resize, highlight, unhighlight, sizeHighlight, sizeUnhighlight, xHighlight, xUnhighlight, closePane} = this;

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
            if(albumTracks) {
                return(
                    albumTracks.map(function(track, i){
                        return <Tracks track={track.name} artist={track.artists[0].name} id={track.uri} onClickedTrack={handleNewClickedTrack} key={i} />;
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

        function newContainer(key, content, type, top, left, height, width, title){
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
                    close={closePane.bind(null, type)}
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
                    />;
        }

        function renderContainers(){
            var renderArray=[newContainer(0, renderOptions(), 'options', 60, 0, 200, 100, "menu")];
            var renderKey = 1;

            if (youtubeEnabled){
                renderArray.push(<Video key={renderKey}/>);
                renderKey++;
                renderArray.push(newContainer(renderKey, <YoutubeControls />, 'youtube-controls', 75, 1125, 100, 100));
                renderKey++;
            }
            if(searchPaneOpen){
                renderArray.push(newContainer(renderKey,
                    <PlayerForm onArtistSubmit={handleNewArtist} onAlbumSubmit={handleNewAlbum} onTrackSubmit={handleNewTrack}/>,
                    'search-bar', 260, 0, 240, 280, "search"));
                renderKey++;
            }
            if (spotifyPaneOpen) {
                renderArray.push(newContainer(renderKey, renderSpotify(), 'spotify-results', 100, 500, 100, 300, "spotify"));
                renderKey++;
            }
            if (artistPaneOpen){
                renderArray.push(newContainer(renderKey, renderArtistResults(), 'artist-results', 320, 0, 260, 330, "artists"));
                renderKey++;
            }
            if (albumPaneOpen){
                renderArray.push(newContainer(renderKey, renderAlbumResults(), 'album-results', 400, 620, 200, 200, "albums"));
                renderKey++;
            }
            if (tracksPaneOpen){
                renderArray.push(newContainer(renderKey, renderTracks(), 'tracks-pane', 150, 120, 200, 200, "tracks"));
                renderKey++;
            }
            if (lyricsPaneOpen) {
                renderArray.push(newContainer(renderKey, renderLyrics(), 'lyrics-pane', 300, 420, 200, 200, "lyrics"));
                renderKey++;
            }
            if (recentPaneOpen) {
                renderArray.push(newContainer(renderKey, renderRecentScrobbles(username), 'scrobble-pane', 350, 520, 200, 200, "recent"));
                renderKey++;
            }
            if (newsPaneOpen) {
                renderArray.push(newContainer(renderKey, renderNews(), 'news-pane', 450, 720, 200, 200, "news"));
            }
            if (livePaneOpen) {
                renderArray.push(newContainer(renderKey, renderLive(), 'live-pane', 500, 820, 200, 200, "live"));
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
