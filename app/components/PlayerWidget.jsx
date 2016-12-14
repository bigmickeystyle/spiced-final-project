var React = require('react');

var PlayerWidget = React.createClass({
    render: function(){
        return (
            <div>
                <iframe src={`https://embed.spotify.com/?uri=${this.props.uri}`} width="300" height="300" frameBorder="0" allowTransparency="true"></iframe>
            </div>
        );
    }
});

module.exports = PlayerWidget;
