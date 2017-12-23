import React from 'react'
import Cookies from 'js-cookie'
import auth from "../auth.js";
import { Redirect } from 'react-router'


export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          fireRedirect: false,
        };
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(event) {
        event.preventDefault();
        auth.login(this.refs.username.value,this.refs.password.value,(loggedIn) => {
            if (loggedIn) {
                this.setState({ fireRedirect: true });
            }
        })
    }

    render() {
        const { fireRedirect } = this.state
        return (
            <div className="login-page">
                <div className="form">
                    <form className="login-form" method='post' onSubmit={this.handleLogin}>
                        <div>
                            <input className="form-control" type="text" name="username" ref="username" placeholder="Username" required/>
                        </div>
                        <div>
                            <input className="form-control" type="password" name='password' ref="password" placeholder="Password" required/>
                        </div>
                        <button className="form-button" type="submit">Submit</button>
                    </form>
                    {fireRedirect && (
                        <Redirect to={'/main/'}/>
                    )}
                </div>
            </div>
        );
    }
}
