var React = require('react');
var getLastFM = require('getLastFM');
var getDiscog = require('getDiscog');
var getYoutube = require('getYoutube');
var genius = require('genius');
var PlayerContainer = require('PlayerContainer');
var PlayerForm = require('PlayerForm');
var AlbumResults = require('AlbumResults');
var PlayerWidget = require('PlayerWidget');
var Tracks = require('Tracks');
var Lyrics = require('Lyrics');
var Video = require('Video');
var RecentScrobbles = require('RecentScrobbles');
var ArtistResults = require('ArtistResults');

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var getSpotify = require('getSpotify');

var Player = React.createClass({

    getInitialState: function(){
        return {
            isLoadingArtists: false,
            albumLoading: false,
            artistSearchSubmitted:false,
            loadSpotify: false,
            searchBar: true,
            recentScrobbles: true,
            username: 'braveshave'
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

    move: function(pane, eventStart) {
        var startLeft = eventStart.pageX - parseInt($(`#${pane}`).css('left'));
        var startTop = eventStart.pageY - parseInt($(`#${pane}`).css('top'));
        var arrowLeft = eventStart.pageX - parseInt(($(`#${pane}Arrow`).css('left')));
        var arrowTop = eventStart.pageY - parseInt(($(`#${pane}Arrow`).css('top')));
        $(document).on('mousemove.boxmove', function(e){
            e.preventDefault();
            $(`#${pane}`).css({left: e.pageX - startLeft, top: e.pageY - startTop});
            $(`#${pane}Arrow`).css({left: e.pageX - arrowLeft, top: e.pageY - arrowTop});
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
        this.setState({
            isLoadingArtists: true,
            artistSearchSubmitted: true
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
        var thisState = this;
        thisState.setState({
            albumLoading: true
        });
        getSpotify.getAlbum(id).then(function(albumSpotDetails){
            thisState.setState({
                albumLoading: false,
                albumTracks: albumSpotDetails.tracks.items
            });
        });
    },

    handleNewClickedTrack: function(artist, track, id){
        getYoutube.getVideo(artist, track).then(function(videoDetails){
            var firstResult = videoDetails[0].id.videoId;
            $('#player').attr('src', `https://www.youtube.com/embed/${firstResult}?showinfo=0&enablejsapi=1&amp;&amp;widgetid=1`);
        });
        var thisState = this;
        thisState.setState({
            lyricsLoading: true,
            loadSpotify: true,
            uri: id
        });

        genius.getSong(artist, track).then(function(lyrics){
            thisState.setState({
                lyrics: lyrics,
                lyricsLoading: false
            });

        });
    },

    handleNewClickedArtist: function (artist, id) {
        var thisState = this;
        thisState.setState({
            albumsLoading: true
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

    render: function () {
        var {isLoadingArtists, artist, artists, albums, uri, albumTracks, lyrics, albumLoading, lyricsLoading, artistSearchSubmitted, loadSpotify, searchBar, recentScrobbles, username} = this.state;
        var {handleNewClickedAlbum, handleNewClickedTrack, handleNewClickedArtist, handleNewArtist, handleNewAlbum, handleNewTrack, handleScrobbles, move, resize} = this;

        function renderAlbumResults(){
            return (
                albums.map(function(album, i){
                    return <AlbumResults artist={artist} id={album.id} album={album.name} onClickedAlbum={handleNewClickedAlbum} key={i}/>;
                })
            );
        }

        function displayArtists(){
            return (
                artists.map(function(artistResult, i){
                    return <ArtistResults artist={artistResult.name} id={artistResult.id} onClickedArtist={handleNewClickedArtist} key={i}/>;
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
            }
            if(lyrics) {
                lyrics = lyrics.split('\n');
                return(
                    lyrics.map(function(line, i){
                        console.log(line);
                        return <Lyrics line={line} key={i} />;
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

        function newContainer(key, content, type, top, left){
            var arrowLeft = left + 80;
            var arrowTop = top + 80;
            return <PlayerContainer
                    key={key}
                    content={content}
                    type={type}
                    resize={resize.bind(null, type)}
                    move={move.bind(null, type)}
                    containerStyle={{
                        top: `${top}px`,
                        left: `${left}px`,
                        height: '100px',
                        width: '100px'
                    }}
                    arrowStyle={{
                        left: arrowLeft,
                        top: arrowTop
                    }}
                    />;
        }

        function renderContainers(){
            var renderArray=[];
            var renderKey = 0;
            if(searchBar){
                renderArray.push(newContainer(renderKey,
                    <PlayerForm onArtistSubmit={handleNewArtist} onAlbumSubmit={handleNewAlbum} onTrackSubmit={handleNewTrack}/>,
                    'search-bar', 100, 20));
                renderKey++;
                renderArray.push(<Video />);
                renderKey++;
            }
            if(loadSpotify) {
                renderArray.push(renderSpotify());
                renderKey++;
            }
            if(artistSearchSubmitted){
                renderArray.push(newContainer(renderKey, renderArtistResults(), 'artist-results', 200, 220));
                renderKey++;
            }
            if(albums){
                renderArray.push(newContainer(renderKey, renderAlbumResults(), 'album-results', 400, 620));
                renderKey++;
            }
            if (albumTracks){
                renderArray.push(newContainer(renderKey, renderTracks(), 'tracks-pane', 150, 120));
                renderKey++;
            }
            if (lyrics || lyricsLoading) {
                renderArray.push(newContainer(renderKey, renderLyrics(), 'lyrics-pane', 300, 420));
                renderKey++;
            }
            if (recentScrobbles) {
                renderArray.push(newContainer(renderKey, renderRecentScrobbles(username), 'scrobble-pane', 350, 520));
                renderKey++;
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
