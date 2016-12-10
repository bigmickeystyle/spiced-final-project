var React = require('react');



var playerContainer = React.createClass({

    render: function(){
        return (
            <div className="bubble">
                <img id={this.props.type + "-x"} className="x" src="./images/x.png" onClick={this.props.close} style={this.props.xStyle} onMouseEnter={this.props.xHighlight} onMouseLeave={this.props.xUnhighlight}></img>
                <div id={this.props.type} className="player-container" onMouseEnter={this.props.highlight} onMouseLeave={this.props.unhighlight} onMouseDown={this.props.move} style={this.props.containerStyle}>
                    <div className="vertical-title"><div>{this.props.boxTitle}</div></div>
                    <div className="content">{this.props.content}</div>
                </div>
                <img id={this.props.type + "Arrow"} className="arrow" src="./images/arrow.jpg" onMouseEnter={this.props.sizeHighlight} onMouseLeave={this.props.sizeUnhighlight} onMouseDown={this.props.resize} style={this.props.arrowStyle}/>
            </div>
        );
    }
});

module.exports = playerContainer;
