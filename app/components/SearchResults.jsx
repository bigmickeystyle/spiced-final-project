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
            <div className="search-result" onClick={this.onClickedAlbum}>
                <p>{topAlbum}</p>
            </div>
        );
    }
});

module.exports = SearchResults;
