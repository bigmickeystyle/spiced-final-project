var React = require('react');

var ArtistResults = React.createClass({
    onClickedArtist: function() {
        var {onClickedArtist, artist, id} = this.props;
        onClickedArtist(artist, id);
    },
    render: function() {
        var {artist, id, image} = this.props;
        return (
            <div className="result media-object" id={id} onDoubleClick={this.onClickedArtist}>
                <div className="media-object-section">
                    <div className="thumbnail">
                      <img className="artist-image" src={image}></img>
                    </div>
                </div>
                <div className="media-object-section main-section">
                    <p>{artist}</p>
                </div>
            </div>
        );
    }
});

module.exports = ArtistResults;
