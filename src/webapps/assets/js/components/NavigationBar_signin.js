import React from 'react'
// import logo from '../../images/react-logo-1000-transparent.png';
import logo from '../../images/logo.png';
import { Redirect } from 'react-router'
export default class NavigationBarSignup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fireRedirect: false,
        };
        this.handleRedirect = this.handleRedirect.bind(this);
    }

    handleRedirect(event) {
        event.preventDefault();
        this.setState({ fireRedirect: true });
    }

    render() {
        const { fireRedirect } = this.state
        return (
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <a className="navbar-brand" href="#">
                    <img className="nav-logo" src={logo} height="35"/>
                    <span>HyperMap</span>
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                        aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/main/">Home <span className="sr-only">(current)</span></a>
                        </li>
                    </ul>
                    <form className="navbar-form navbar-right" onSubmit={this.handleRedirect}>
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Sign in</button>
                    </form>

                    {fireRedirect && (
                        <Redirect to={'/login/'}/>
                    )}
                </div>
            </nav>

        )
    }
}
