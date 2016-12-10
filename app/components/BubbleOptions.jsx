var React = require('react');

var BubbleOptions = React.createClass({

    onClickedOption: function(){
        var {option, onClickedOption} = this.props;
        onClickedOption(option);
    },

    render: function(){
        var {option} = this.props;
        return (
            <li className="menu result" onClick={this.onClickedOption}>{option}</li>
        );
    }
});

module.exports = BubbleOptions;
