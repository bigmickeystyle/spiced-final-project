var React = require('react');

var Playlist = React.createClass({
    onClickedTrack: function() {
        var {artist, track, id, num, onClickedTrack} = this.props;
        onClickedTrack(artist, track, id, num);
    },
    render: function() {
        var {track, id} = this.props;
        return (
            <div className="result" id={id} onDoubleClick={this.onClickedTrack}>
                <p>{track}</p>
            </div>
        );
    }
});

module.exports = Playlist;
