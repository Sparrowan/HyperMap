import React  from 'react'
import NavigationBarLogin from "../components/NavigationBar_login";
import SideBar from "../components/SideBar";
import CreatEventForm from "../components/CreatEventForm";
import MyMap from "../components/map/MyMap";
import Recommendation from "../components/Recommendation";

export default class MainPage extends React.Component{
    constructor() {
        super();
        this.getRecommendation = this.getRecommendation.bind(this);
    };

    getRecommendation() {
        this.refs.rec.getRecommendation();
    }

    render(){
        return (
            <div>
                <div className="row">
                    <NavigationBarLogin present='home'/>
                </div>
                <div className="row">
                    <div className="col-md-4 col-lg-4 col-sm-4">
                        <div className="row">
                            <SideBar/>
                            <Recommendation ref="rec"/>
                        </div>
                        <div className="row">
                        </div>
                    </div>
                    <div className="col-md-8 col-lg-8 col-sm-8" >
                        <div className="row">
                            <CreatEventForm />
                        </div>
                        <div className="row map">
                            <MyMap getRecommendation={this.getRecommendation}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
