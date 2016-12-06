var React = require('react');



var playerContainer = React.createClass({
    componentDidMount: function (){
        console.log("mounted");
    },

    render: function(){
        return (
            <div>
                <div id={this.props.type} className="player-container" onMouseDown={this.props.move} style={this.props.containerStyle}>
                    {this.props.content}
                </div>
                <img id={this.props.type + "Arrow"} src="./images/arrow.jpg" onMouseDown={this.props.resize} style={this.props.arrowStyle}/>
            </div>
        );
    }
});

module.exports = playerContainer;
