import React, { Component } from 'react';

import '../../css/bootstrap.min.css';
import '../../css/mycss.css';


import NavigationBarLogin from "../components/NavigationBar_login";
import SideBar from "../components/SideBar";
import ShowCreateGroup from "../components/CreatGroupForm";
import GroupList from "../components/GroupList";

export default class ProfileGroupPage extends React.Component{

    constructor() {
        super();
        this.getGroups = this.getGroups.bind(this);
    };

    getGroups() {
        this.refs.grouplist.getGroups();
    }

    render() {
        return(
            <div>
                <div className="row">
                    <NavigationBarLogin present='group'/>
                </div>
                <div className="row">
                    <div className="col-md-4 col-lg-4 col-sm-4">
                        <SideBar/>
                    </div>
                    <div className="col-md-8 col-lg-8 col-sm-8">
                        <button disabled className="title-style" >My Groups</button>
                        <GroupList ref="grouplist"/>
                        <ShowCreateGroup
                            getGroups={this.getGroups}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
