var React = require('react');

var PlayerWidget = ({uri}) => {
    return (
        <div>
            <p>{uri}</p>
            <iframe src={"https://embed.spotify.com/?uri=" + uri} width="300" height="380" frameBorder="0" allowTransparency="true"></iframe>
        </div>
    );
};

module.exports = PlayerWidget;
