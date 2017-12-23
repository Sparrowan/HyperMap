import React, { Component } from 'react';

import '../../css/bootstrap.min.css';
import '../../css/mycss.css';
import NavigationBarLogin from "../components/NavigationBar_login";
import SideBar from "../components/SideBar";
import EventListCreated from "../components/EventListCreated";

export default class ProfileEventPage extends React.Component{
    render (){
        return(
            <div>
                <div className="row">
                    <NavigationBarLogin present='profileevent'/>
                </div>
                <div className="row">
                    <div className="col-md-4 col-lg-4 col-sm-4">
                        <SideBar/>
                    </div>
                    <div className="col-md-8 col-lg-8 col-sm-8">
                        <button disabled  className="title-style" >Created Events</button>
                        <EventListCreated/>
                    </div>
                </div>
            </div>
        )
    }
}
