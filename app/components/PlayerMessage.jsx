var React = require('react');

var PlayerMessage = ({artist, topAlbum}) => {
    // aka: var {artist, topAlbum} = props;
    return (
        <div>
            <h1>{artist}</h1>
            <h2>{topAlbum}</h2>
        </div>
    );
};

module.exports = PlayerMessage;
