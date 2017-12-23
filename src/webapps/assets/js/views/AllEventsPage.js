import React, { Component } from 'react';

import '../../css/bootstrap.min.css';
import '../../css/mycss.css';


import NavigationBarLogin from "../components/NavigationBar_login";
import SideBar from "../components/SideBar";


import EventList from "../components/EventList";
import AllEvents from "../components/AllEvents";

export default class AllEventPage extends React.Component{
    render (){
        return(
            <div>
                <div className="row">

                    <NavigationBarLogin present="search"/>
                </div>

                <div className="row">
                    <div className="col-md-4 col-lg-4 col-sm-4">

                        <SideBar/>

                    </div>

                    <div className="col-md-8 col-lg-8 col-sm-8">
                        <AllEvents/>

                    </div>


                </div>
            </div>
        )
    }
}