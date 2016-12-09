var React = require('react');

var ArtistResults = React.createClass({
    onClickedArtist: function() {
        var {onClickedArtist, artist, id} = this.props;
        onClickedArtist(artist, id);
    },
    render: function() {
        var {artist, id} = this.props;
        return (
            <div className="artist-result" id={id} onDoubleClick={this.onClickedArtist}>
                <p>{artist}</p>
            </div>
        );
    }
});

module.exports = ArtistResults;
