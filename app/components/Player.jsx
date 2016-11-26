var React = require('react');
var PlayerForm = require('PlayerForm');

var Player = React.createClass({
    handleNewArtist: function (artist) {
        console.log("handling new artist:");
        console.log(artist);
    },

    render: function () {
        return (
            <PlayerForm onSubmit={this.handleNewArtist}/>
        );
    }
});

module.exports = Player;
