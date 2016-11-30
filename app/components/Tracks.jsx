var React = require('react');

var Tracks = React.createClass({
    onClickedTrack: function() {
        var {artist, track, onClickedTrack} = this.props;
        onClickedTrack(artist, track);
    },
    render: function() {
        var {track} = this.props;
        return (
            <div className="search-result" onClick={this.onClickedTrack}>
                <p>{track}</p>
            </div>
        );
    }
});

module.exports = Tracks;
