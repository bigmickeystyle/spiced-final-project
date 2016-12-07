var React = require('react');

var youtubeWidget = React.createClass({
    render: function(){
        return (
            <div className="whole-page">
                <div id="player"></div>
            </div>
        );
    }
});

module.exports = youtubeWidget;
