var React = require('react');
var PlayerForm = require('PlayerForm');
var PlayerMessage = require('PlayerMessage');
var getLastArtist = require('getLastArtist');
var PlayerWidget = require('PlayerWidget');
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
            var topAlbum = albums.album[0].name;
            thisState.setState({
                isLoading: false,
                artist: artist,
                topAlbum: topAlbum
            });
        }).then(function(){
            getSpotifyAlbumId.getAlbum(thisState.state.artist, thisState.state.topAlbum).then(function(uri){
                thisState.setState({
                    uri: uri
                });
                console.log(thisState.state);
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

    render: function () {
        var {isLoading, artist, topAlbum, uri} = this.state;
        function renderMessage(){
            if (isLoading) {
                return (
                    <h2>Searching</h2>
                );
            } else if (artist && topAlbum) {
                return (
                    <div>
                        <PlayerMessage artist={artist} topAlbum={topAlbum}/>
                        <PlayerWidget uri={uri} />
                    </div>
                );
            }
        }
        return (
            <div>
                <PlayerForm onSubmit={this.handleNewArtist}/>
                {renderMessage()}
            </div>
        );
    }
});

module.exports = Player;
