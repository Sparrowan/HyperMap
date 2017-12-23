import React from 'react'
import { Route, Link } from 'react-router-dom';
import { Redirect } from 'react-router'
import Cookies from 'js-cookie'

export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fireRedirect: false,
        };
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleRegister(event) {
        event.preventDefault();
        fetch('/register/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.refs.username.value,
                password: this.refs.password.value,
                email: this.refs.email.value,
                first_name: this.refs.first_name.value,
                last_name: this.refs.last_name.value,
                password1: this.refs.password1.value,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.hasOwnProperty('success')) {
                alert("An confirmation email has been sent to your email address.\nPlease confirm your registration.")
                this.setState({
                    fireRedirect:true
                });
            }
            else {
                Object.keys(responseJson).forEach(function(key) {
                    alert(responseJson[key]);
                })
            }
        })
    }

    render() {
        const { fireRedirect } = this.state
            return (
            <div className="login-page">
                <div className="form">
                    <form className="login-form" method='post' onSubmit={this.handleRegister}>
                        <div className="row">
                            <div className="col-xs-6 col-lg-6 col-md-6">
                                <input required className="form-control" type="text" name="first_name" ref="first_name" placeholder="First Name"/>
                            </div>
                            <div className="col-xs-6 col-lg-6 col-md-6">
                                <input required className="form-control" type="text" name="last_name" ref="last_name" placeholder="Last Name"/>
                            </div>
                        </div>
                        <div>
                            <input required className="form-control" type="text" name="username" ref="username" placeholder="Username"/>
                        </div>
                        <div>
                            <input required className="form-control" type="email" name="email" ref="email" placeholder="Email"/>
                        </div>
                        <div>
                            <input required className="form-control" type="password" name="password" ref="password"  placeholder="Password"/>
                        </div>
                        <div>
                            <input required className="form-control" type="password" name="password2" ref="password1"  placeholder="Re-enter Password"/>
                        </div>
                        <button className="form-button" type='submit'>Submit</button>
                    </form>
                    
                    {fireRedirect && (
                        <Redirect to={'/login/'}/>
                    )}
                </div>
            </div>
        );
    }
}
