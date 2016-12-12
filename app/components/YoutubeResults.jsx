var React = require('react');

var YoutubeResults = React.createClass({
    onClickedTrack: function() {
        var {id, onClickedTrack} = this.props;
        onClickedTrack(id);
    },
    render: function(){
        var {title, image} = this.props;
        return (
            <div className="result media-object">
                <div className="media-object-section">
                    <div className="thumbnail">
                      <img className="artist-image" src={image}></img>
                    </div>
                </div>
                <div className="media-object-section main-section" onDoubleClick={this.onClickedTrack}>
                    <p>{title}</p>
                </div>
            </div>
        );
    }
});

module.exports = YoutubeResults;
