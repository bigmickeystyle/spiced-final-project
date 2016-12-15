var React = require('react');

var RegisterForm = React.createClass({
    submitForm: function(e){
        e.preventDefault();
        this.props.onRegisterSubmit(this.refs.username.value, this.refs.email.value, this.refs.password.value);
    },
    render: function(){
        return(
                <form id="registration-form" onSubmit={this.submitForm}>
                    <div className="row">
                        <div className="small-8">
                            <label>
                                Username
                                <input ref="username" type="text" placeholder="Enter Username" aria-describedby="usernameHelpText"></input>
                            </label>
                            <p className="help-text" id="usernameHelpText">Your password must have at least 10 characters, a number, and an Emoji.</p>
                        </div>
                        <div className="small-8">
                            <label>
                                Email Address
                                <input ref="email" type="text" placeholder="Enter Email Address"></input>
                            </label>
                        </div>
                        <div className="small-8">
                            <label>
                                Password
                                <input ref="password" type="password" placeholder="Choose Password"></input>
                            </label>
                        </div>
                        <input type="submit" className="button" value="Submit"></input>
                    </div>
                </form>
        );
    }
});

module.exports = RegisterForm;
