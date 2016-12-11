var React = require('react');

var YoutubeControls = React.createClass({
    componentWillUpdate: function(){
        console.log("weeeeee");
    },
    
    onNext: function(){
        this.props.onNext();
    },

    onPrev: function(){
        this.props.onPrev();
    },

    render: function(){
        return (
            <div id="controls-image">
                <div id="play-container">
                    <img id="play-img" src='./images/pause.png'></img>
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
