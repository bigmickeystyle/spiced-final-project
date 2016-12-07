var React = require('react');



var playerContainer = React.createClass({

    render: function(){
        return (
            <div>
                <div id={this.props.type} className="player-container" onMouseDown={this.props.move} style={this.props.containerStyle}>
                    {this.props.content}
                </div>
                <img id={this.props.type + "Arrow"} className="arrow" src="./images/arrow.jpg" onMouseDown={this.props.resize} style={this.props.arrowStyle}/>
            </div>
        );
    }
});

module.exports = playerContainer;
