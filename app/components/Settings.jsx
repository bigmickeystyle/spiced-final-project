var React = require('react');

var Settings = React.createClass({
    onChangedTheme: function(e){
        this.props.onChange(e.target.value);
    },

    render: function(){
        var {currentTheme} = this.props;
        return(
            <label>
                Theme
                    <select value={currentTheme} onChange={this.onChangedTheme}>
                        <option value="default">Default</option>
                        <option value="sunrise">Sunrise</option>
                        <option value="transparent`">Transparent</option>
                        <option value="corona">Corona</option>
                    </select>
            </label>
        );
    }
});

module.exports = Settings;
