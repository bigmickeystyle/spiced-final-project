var React = require('react');
var getLastFM = require('getLastFM');
var getDiscog = require('getDiscog');
var genius = require('genius');
var PlayerContainer = require('PlayerContainer');
var PlayerForm = require('PlayerForm');
var SearchResults = require('SearchResults');
var PlayerWidget = require('PlayerWidget');
var Tracks = require('Tracks');
var Lyrics = require('Lyrics');
var RecentScrobbles = require('RecentScrobbles');




var getSpotifyAlbumId = require('getSpotifyAlbumId');

var Player = React.createClass({

    getInitialState: function(){
        return {
            isLoading: false,
            albumLoading: false,
            searchSubmitted:false,
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
            isLoading: true,
            searchSubmitted: true
        });
        var thisState = this;
        getDiscog.getAlbums(artist).then(function(albums){
            var topAlbumNames = albums.map(function(album){
                if(album.format.indexOf("Unofficial Release") == -1){
                    return album.title.split(' - ')[1];
                }
            }).filter(function(album){
                return album != undefined;
            });
            thisState.setState({
                isLoading: false,
                artist: artist,
                topAlbums: topAlbumNames
            });
        }).catch(function(err){
            console.log(err);
            thisState.setState({
                isLoading: false,
                artist: artist,
                topAlbum: 'apologies, no album found for this artist'
            });
        });
    },

    handleNewClickedAlbum: function (artist, album) {
        var thisState = this;
        thisState.setState({
            albumLoading: true,
            loadSpotify: true
        });
        getSpotifyAlbumId.getAlbum(artist, album).then(function(albumSpotDetails){
            thisState.setState({
                albumLoading: false,
                uri: albumSpotDetails.uri
            });
            getLastFM.getAlbumDetails(albumSpotDetails.artists[0].name, album).then(function(albumLastDetails){
                console.log(albumLastDetails);
                thisState.setState({
                    albumTracks: albumLastDetails.tracks.track
                });
            });
        });
    },

    handleNewClickedTrack: function(artist, track){
        var thisState = this;
        thisState.setState({
            lyricsLoading: true
        });
        genius.getSong(artist, track).then(function(lyrics){
            thisState.setState({
                lyrics: lyrics,
                lyricsLoading: false
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
        var {isLoading, artist, topAlbums, uri, albumTracks, lyrics, albumLoading, lyricsLoading, searchSubmitted, loadSpotify, searchBar, recentScrobbles, username} = this.state;
        var {handleNewClickedAlbum, handleNewClickedTrack, handleNewArtist, handleScrobbles, move, resize} = this;

        function displayAlbums(){
            return (
                topAlbums.map(function(album, i){
                    return <SearchResults artist={artist} topAlbum={album} onClickedAlbum={handleNewClickedAlbum} key={i}/>;
                })
            );
        }

        function renderResults(){
            if (isLoading) {
                return (
                    <h2>Searching</h2>
                );
            } else if (artist && topAlbums){
                return (
                    <div>
                        <div className="album-results-container">
                            {displayAlbums()}
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
                        return <Tracks track={track.name} artist={track.artist.name} onClickedTrack={handleNewClickedTrack} key={i} />;
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
            console.log(recentScrobbles);
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
                renderArray.push(newContainer(renderKey, <PlayerForm onSubmit={handleNewArtist}/>, 'search-bar', 100, 20));
                renderKey++;
            }
            if(loadSpotify) {
                renderArray.push(newContainer(renderKey, renderSpotify(), 'spotify-results', 250, 320));
                renderKey++;
            }
            if(searchSubmitted){
                renderArray.push(newContainer(renderKey, renderResults(), 'search-results', 200, 220));
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
