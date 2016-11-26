var React = require('react');

var PlayerMessage = React.createClass({
    render: function(){
        var {artist} = this.props;
        var {topAlbum} = this.props;
        return (
            <div>
                <h1>{artist}</h1>
                <h2>{topAlbum}</h2>
            </div>
        );
    }
});

module.exports = PlayerMessage;
