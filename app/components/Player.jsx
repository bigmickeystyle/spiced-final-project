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

    componentDidMount: function (){
        var artist = this.props.location.query.artist;
        if (artist) {
            this.handleNewArtist(artist);
            window.location.hash = '#/';
        }
    },

    componentWillReceiveProps: function (newProps) {
        var artist = newProps.location.query.artist;
        if (artist) {
            this.handleNewArtist(artist);
            window.location.hash = '#/';
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
            } else if (artist && topAlbums && uri) {
                return (
                    <div>
                        <div className="album-results-container">
                            {displayAlbums()}
                            <PlayerWidget uri={uri} />
                        </div>

                    </div>
                );
            } else if (artist && topAlbums){
                return (
                    <div>
                        <div className="album-results-container">
                            {displayAlbums()}
                        </div>
                        <p>sorry, this is not available to play</p>
                    </div>
                );
            }
        }
        return (
            <div className="player-container">
                <PlayerForm onSubmit={this.handleNewArtist}/>
                {renderResults()}
            </div>
        );
    }
});

module.exports = Player;
