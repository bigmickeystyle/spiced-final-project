var React = require('react');

var SearchResults = React.createClass({
    onClickedAlbum: function() {
        var {artist, topAlbum, onClickedAlbum} = this.props;
        console.log(this.props);
        onClickedAlbum(artist, topAlbum);
    },
    render: function() {
        var {topAlbum} = this.props;
        return (
            <div onClick={this.onClickedAlbum}>
                <h3>{topAlbum}</h3>
            </div>
        );
    }
});

module.exports = SearchResults;
