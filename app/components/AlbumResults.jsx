var React = require('react');

var SearchResults = React.createClass({
    onClickedAlbum: function() {
        var {id, onClickedAlbum} = this.props;
        onClickedAlbum(id);
    },
    render: function() {
        var {album, id} = this.props;
        return (
            <div className="result" id={id} onDoubleClick={this.onClickedAlbum}>
                <p>{album}</p>
            </div>
        );
    }
});

module.exports = SearchResults;
