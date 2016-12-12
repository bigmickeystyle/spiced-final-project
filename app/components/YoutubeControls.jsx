var React = require('react');

var YoutubeControls = React.createClass({

    onNext: function(){
        this.props.onNext();
    },

    onPrev: function(){
        this.props.onPrev();
    },

    onPause: function(){
        this.props.onPause();
    },

    render: function(){
        return (
            <div id="controls-image">
                <div id="play-container">
                    <img onClick={this.onPause} id="play-img" src='./images/pause.png'></img>
                </div>
                <div id="prev-container">
                    <img onClick={this.onPrev} id="prev-img" src='./images/prev.png'></img>

                </div>
                <div id="next-container">
                    <img onClick={this.onNext} id="next-img" src='./images/next.png'></img>
                </div>
            </div>

        );
    }
});

module.exports = YoutubeControls;
