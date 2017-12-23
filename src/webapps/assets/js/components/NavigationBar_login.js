import React from 'react'
// import logo from '../../images/react-logo-1000-transparent.png';
import auth from "../auth.js";
import logo from '../../images/logo.png';
import { Redirect } from 'react-router'

export default class NavigationBarLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fireRedirect: false,
            redirectProfile: false,
            redirectGroupList: false,
            redirectAllEvents: false,
            redirectFootprint: false,
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.redirectMain = this.redirectMain.bind(this);
        this.redirectEdit = this.redirectEdit.bind(this);
        this.redirectProfile = this.redirectProfile.bind(this);
        this.redirectGroupList = this.redirectGroupList.bind(this);
        this.redirectFootprint = this.redirectFootprint.bind(this);
        this.redirectAllEvents = this.redirectAllEvents.bind(this);
    }

    redirectMain(event) {
        event.preventDefault();
        this.setState({ redirectMain: true });
    }

    redirectEdit(event) {
        event.preventDefault();
        this.setState({ redirectEdit: true });
    }

    redirectProfile(event) {
        event.preventDefault();
        this.setState({ redirectProfile: true });
    }

    redirectGroupList(event) {
        event.preventDefault();
        this.setState({ redirectGroupList: true });
    }

    redirectAllEvents(event) {
        event.preventDefault();
        this.setState({ redirectAllEvents: true });
    }

    redirectFootprint(event) {
        event.preventDefault();
        this.setState({ redirectFootprint: true });
    }

    handleLogout(event) {
        auth.logout()
        this.setState({ fireRedirect: true });
    }

    render() {
        const { fireRedirect, redirectFootprint,redirectAllEvents, redirectGroupList, redirectProfile, redirectEdit, redirectMain} = this.state
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
                        {this.props.present === "home" ?
                            <li className="nav-item  active">
                                <a className="nav-link hover-pointer" onClick={this.redirectMain}>Home</a>
                            </li>:
                            <li className="nav-item">
                                <a className="nav-link hover-pointer" onClick={this.redirectMain}>Home</a>
                            </li>}

                        {this.props.present === "edit" ?
                            <li className="nav-item  active">
                                <a className="nav-link hover-pointer" onClick={this.redirectEdit}><i className
                                                                                                         ="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</a>
                            </li>:
                            <li className="nav-item">
                                <a className="nav-link hover-pointer" onClick={this.redirectEdit}><i className
                                                                                                         ="fa fa-pencil-square-o" aria-hidden="true"></i>Edit</a>
                            </li>}

                        {this.props.present === "profileevent" ?
                            <li className="nav-item  active">
                                <a className="nav-link hover-pointer" onClick={this.redirectProfile}><i className="fa fa-tree" aria-hidden="true"></i>Created</a>
                            </li>:
                            <li className="nav-item">
                                <a className="nav-link hover-pointer" onClick={this.redirectProfile}><i className="fa fa-tree" aria-hidden="true"></i>Created</a>
                            </li>}


                        {this.props.present === "group" ?
                            <li className="nav-item  active">
                                <a className="nav-link hover-pointer" onClick={this.redirectGroupList}> <i className="fa fa-users" aria-hidden="true"></i>Group</a>
                            </li> :
                            <li className="nav-item">
                                <a className="nav-link hover-pointer" onClick={this.redirectGroupList}> <i className="fa fa-users" aria-hidden="true"></i>Group</a>
                            </li>}

                        {this.props.present === "search" ?
                            <li className="nav-item active">
                                <a className="nav-link hover-pointer" onClick={this.redirectAllEvents}><i className="fa fa-globe" aria-hidden="true"></i>Search</a>
                            </li> :
                            <li className="nav-item">
                                <a className="nav-link hover-pointer" onClick={this.redirectAllEvents}><i className="fa fa-globe" aria-hidden="true"></i>Search</a>
                            </li>}

                        {this.props.present === "footprint" ?
                            <li className="nav-item active">
                                <a className="nav-link hover-pointer" onClick={this.redirectFootprint}><i className="fa fa-street-view" aria-hidden="true"></i>Footprints</a>
                            </li> :
                            <li className="nav-item">
                                <a className="nav-link hover-pointer" onClick={this.redirectFootprint}><i className="fa fa-street-view" aria-hidden="true"></i>Footprints</a>
                            </li>}

                    </ul>
                    <button className="btn btn-outline-success my-2 my-sm-0" onClick={this.handleLogout}>Log out</button>

                    {fireRedirect && (
                        <Redirect to={'/login/'}/>
                    )}

                    {redirectMain&& (
                        <Redirect to={'/main/'}/>
                    )}

                    {redirectEdit&& (
                        <Redirect to={'/edit_profile/'}/>
                    )}

                    {redirectProfile && (
                        <Redirect to={'/profile/'}/>
                    )}

                    {redirectGroupList && (
                        <Redirect to={'/grouplist/'}/>
                    )}

                    {redirectAllEvents && (
                        <Redirect to={'/all_events/'}/>
                    )}

                    {redirectFootprint && (
                        <Redirect to={'/footprint/'}/>
                    )}
                </div>
            </nav>
        )
    }
}
