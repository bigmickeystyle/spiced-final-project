var React = require('react');
var PlayerForm = require('PlayerForm');
var Tracks = require('Tracks');
var SearchResults = require('SearchResults');
var getLastFM = require('getLastFM');
var PlayerWidget = require('PlayerWidget');
var genius = require('genius');
var Lyrics = require('Lyrics');

var getSpotifyAlbumId = require('getSpotifyAlbumId');

var Player = React.createClass({

    getInitialState: function(){
        return {
            isLoading: false
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
            console.log('stopped');
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
            console.log('stopped');
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
            isLoading: true
        });
        var thisState = this;
        getLastFM.getTopAlbums(artist).then(function(albums){
            var topAlbumNames = albums.album.map(function(album){
                return album.name;
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
        getSpotifyAlbumId.getAlbum(artist, album).then(function(albumSpotDetails){
            thisState.setState({
                uri: albumSpotDetails.uri
            });
            getLastFM.getAlbumDetails(albumSpotDetails.artists[0].name, album).then(function(albumLastDetails){
                thisState.setState({
                    albumTracks: albumLastDetails.tracks.track
                });
            });
        });
    },

    handleNewClickedTrack: function(artist, track){
        var thisState = this;
        genius.getSong(artist, track).then(function(lyrics){
            thisState.setState({
                lyrics: lyrics
            });

        });
    },

    render: function () {
        var {isLoading, artist, topAlbums, uri, albumTracks, lyrics} = this.state;
        var handleNewClickedAlbum = this.handleNewClickedAlbum;
        var handleNewClickedTrack = this.handleNewClickedTrack;
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
        return (
            <div>
                <div id="player-pane" className="player-container" onMouseDown={this.move.bind(null, 'player-pane')}>
                    <PlayerForm onSubmit={this.handleNewArtist}/>
                </div>
                <img id="player-paneArrow" src="./images/arrow.jpg" onMouseDown={this.resize.bind(null, 'player-pane')}/>
                <div id="second-pane" className="player-container" onMouseDown={this.move.bind(null, 'second-pane')}>
                    {renderResults()}
                </div>
                <img id="second-paneArrow" src="./images/arrow.jpg" onMouseDown={this.resize.bind(null, 'second-pane')}/>
                <div id="third-pane" className="player-container" onMouseDown={this.move.bind(null, 'third-pane')}>
                    {renderSpotify()}
                </div>
                <img id="third-paneArrow" src="./images/arrow.jpg" onMouseDown={this.resize.bind(null, 'third-pane')}/>
                <div id="tracks-pane" className="player-container" onMouseDown={this.move.bind(null, 'tracks-pane')}>
                    {renderTracks()}
                </div>
                <img id="tracks-paneArrow" src="./images/arrow.jpg" onMouseDown={this.resize.bind(null, 'tracks-pane')}/>
                <div id="lyrics-pane" className="player-container" onMouseDown={this.move.bind(null, 'lyrics-pane')}>
                    {renderLyrics()}
                </div>
                <img id="lyrics-paneArrow" src="./images/arrow.jpg" onMouseDown={this.resize.bind(null, 'lyrics-pane')}/>
            </div>
        );
    }
});

module.exports = Player;
