var React = require('react');

var SearchResults = React.createClass({
    onClickedAlbum: function() {
        var {id, onClickedAlbum} = this.props;
        onClickedAlbum(id);
    },
    onDraggedAlbum: function() {
        var {clickedAlbum} = this.props;
        console.log("dragging", clickedAlbum);
    },
    render: function() {
        var {album, image, id} = this.props;
        return (
            <div className="result media-object" id={id} onDoubleClick={this.onClickedAlbum}>
                <div className="media-object-section">
                    <div className="thumbnail">
                      <img className="artist-image" src={image}></img>
                    </div>
                </div>
                <div className="media-object-section main-section">
                    <p>{album}</p>
                </div>
            </div>
        );
    }
});

module.exports = SearchResults;
