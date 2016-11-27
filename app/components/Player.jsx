var React = require('react');
var PlayerForm = require('PlayerForm');
var PlayerMessage = require('PlayerMessage');
var getLastArtist = require('getLastArtist');

var Player = React.createClass({

    getInitialState: function(){
        return {
            isLoading: false
        };
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
        var {isLoading, artist, topAlbum} = this.state;
        function renderMessage(){
            if (isLoading) {
                return (
                    <h2>Searching</h2>
                );
            } else if (artist && topAlbum) {
                return (
                    <PlayerMessage artist={artist} topAlbum={topAlbum}/>
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
