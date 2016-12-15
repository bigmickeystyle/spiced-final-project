var React = require('react');
var RegisterForm = require('RegisterForm');
var axios = require('axios');

var Register = React.createClass({
    handleRegistration: function(username, email, pwd){
        axios.post('/register', {
            username: username,
            email: email,
            pwd: pwd
        }).then(function(response){
            console.log(response);
        }).catch(function(err){
            console.log(err);
        });
    },

    render: function(){
        var {handleRegistration} = this;
        return (
         <RegisterForm onRegisterSubmit={handleRegistration}/>
        );
    }
});

module.exports = Register;
