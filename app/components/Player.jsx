var React = require('react');
var PlayerForm = require('PlayerForm');
var SearchResults = require('SearchResults');
var getLastArtist = require('getLastArtist');
var PlayerWidget = require('PlayerWidget');
var genius = require('genius');
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
        getLastArtist.getTopAlbums(artist).then(function(albums){
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
        getSpotifyAlbumId.getAlbum(artist, album).then(function(uri){
            thisState.setState({
                uri: uri
            });
        });
    },

    render: function () {
        var {isLoading, artist, topAlbums, uri} = this.state;
        var handleNewClickedAlbum = this.handleNewClickedAlbum;
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
            </div>
        );
    }
});

module.exports = Player;
