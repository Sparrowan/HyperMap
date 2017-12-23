import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import '../css/bootstrap.min.css';
import '../css/mycss.css';

import auth from "./auth.js";
import { Redirect } from 'react-router'
import MainPage from "./views/MainPage";
import ProfileEventPage from "./views/ProfileEventPage";
import ProfileGroupPage from "./views/ProfileGroupPage";
import AllEventPage from "./views/AllEventsPage";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import EditProfilePage from "./views/EditProfilePage";
import FootprintPage from "./views/FootprintPage";
import MapWrapper from "./views/MapWrapper";
import MapTest from "./components/map/MapWithSearchBox"
import MyMapTest from "./components/map/MyMapTest"
import MyMap from "./components/map/MyMap"
import ErrorPage from "./views/ErrorPage";

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <main>
                    <Route exact path="/login/" render={() => (
                        auth.loggedIn() ? (
                            <Redirect to="/main/"/>
                        ) : (
                            <LoginPage/>
                        ))}
                    />

                    <Route exact path='/register/' render={() => (
                        auth.loggedIn() ? (
                            <Redirect to="/main/"/>
                        ) : (
                            <RegisterPage/>
                        ))}
                    />

                    <Route path="/main/" exact render={() => (
                        auth.loggedIn() ? (
                            <MainPage/>
                        ) : (
                            <Redirect to="/login/"/>
                        ))}
                    />

                    <Route path='/edit_profile/' exact render={() => (
                        auth.loggedIn() ? (
                            <EditProfilePage/>
                        ) : (
                            <Redirect to="/login/"/>
                        ))}
                    />

                    <Route exact path='/profile/' render={() => (
                        auth.loggedIn() ? (
                            <ProfileEventPage/>
                        ) : (
                            <Redirect to="/login/"/>
                        ))}
                    />

                    <Route exact path='/grouplist/' render={() => (
                        auth.loggedIn() ? (
                            <ProfileGroupPage/>
                        ) : (
                            <Redirect to="/login/"/>
                        ))}
                    />

                    <Route exact path='/all_events/' render={() => (
                        auth.loggedIn() ? (
                            <AllEventPage/>
                        ) : (
                            <Redirect to="/login/"/>
                        ))}
                    />

                    <Route exact path='/footprint/' render={() => (
                        auth.loggedIn() ? (
                            <FootprintPage/>
                        ) : (
                            <Redirect to="/login/"/>
                        ))}
                    />

                    <Route
                        path='/error/'
                        exact
                        render={() => (
                            <ErrorPage/>
                        )
                        }
                    />
                </main>
            </div>
        )
    };
}

export default App;
