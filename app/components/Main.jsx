var React = require('react');
var Nav = require('Nav');

var Main = (props) => {
    console.log(props);
    return (
        <div>
            <Nav />
            {props.children}
        </div>
    );
};

module.exports = Main;
