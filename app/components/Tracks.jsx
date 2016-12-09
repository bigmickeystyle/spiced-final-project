var React = require('react');

var Tracks = React.createClass({
    onClickedTrack: function() {
        var {artist, track, id, onClickedTrack} = this.props;
        onClickedTrack(artist, track, id);
    },
    render: function() {
        var {track, id} = this.props;
        return (
            <div className="search-result" id={id} onDoubleClick={this.onClickedTrack}>
                <p>{track}</p>
            </div>
        );
    }
});

module.exports = Tracks;
