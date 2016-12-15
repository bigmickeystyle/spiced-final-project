var React = require('react');

var Settings = React.createClass({
    onChangedTheme: function(e){
        this.props.onChange(e.target.value);
    },

    render: function(){
        return(
            <label>
                Theme
                    <select onChange={this.onChangedTheme}>
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
