var React = require('react');

var youtubeWidget = React.createClass({
    render: function(){
        return (
            <div>
                <div id="vid-box"></div>
                <div className="whole-page">
                    <div id="player"></div>
                </div>
            </div>
        );
    }
});

module.exports = youtubeWidget;
