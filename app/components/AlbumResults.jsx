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
        var {album, id} = this.props;
        return (
            <div className="result" id={id} onDrag={this.onDraggedAlbum} onDoubleClick={this.onClickedAlbum}>
                <p>{album}</p>
            </div>
        );
    }
});

module.exports = SearchResults;
