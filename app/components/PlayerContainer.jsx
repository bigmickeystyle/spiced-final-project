var React = require('react');



var playerContainer = React.createClass({

    render: function(){
        return (
            <div className="bubble">
                <div id={this.props.type} className={"player-container " + this.props.theme} onMouseOver={this.props.highlight} onMouseLeave={this.props.unhighlight} onMouseDown={this.props.move} style={this.props.containerStyle}>
                    <div className={"vertical-title vertical-" + this.props.theme} id={this.props.type + "-title"}><div>{this.props.boxTitle}</div></div>
                    <div className="content">{this.props.content}</div>
                </div>
                <img id={this.props.type + "-lock"} className="lock" src="./images/unlocked.png" style={this.props.lockStyle}  onMouseEnter={this.props.lockHighlight} onMouseLeave={this.props.lockUnhighlight} onClick={this.props.lock}></img>
                <img id={this.props.type + "Arrow"} className="arrow" src="./images/arrow.png" onMouseEnter={this.props.sizeHighlight} onMouseLeave={this.props.sizeUnhighlight} onMouseDown={this.props.resize} style={this.props.arrowStyle}/>
                <img id={this.props.type + "-x"} className="x" src="./images/x.png" onClick={this.props.close} style={this.props.xStyle} onMouseEnter={this.props.xHighlight} onMouseLeave={this.props.xUnhighlight}></img>
            </div>
        );
    }
});

module.exports = playerContainer;
