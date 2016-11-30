var React = require('react');
var $ = require('jQuery');

var PlayerWidget = React.createClass({
    onIframeClick: function() {
        console.log("clicked");
        var thing = $('iframe');
        console.log(thing);
    },
    render: function(){
        return (
            <div onClick={this.onIframeClick}>
                <iframe src={`https://embed.spotify.com/?uri=${this.props.uri}`} width="300" height="600" frameBorder="0" allowTransparency="true"></iframe>
            </div>
        );
    }
});

module.exports = PlayerWidget;
