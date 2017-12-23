import React from 'react';
import '../../css/bootstrap.min.css';
import '../../css/mycss.css';

import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer"


export default class ErrorPage extends React.Component{
    render(){
        return (
            <div>
                <NavigationBar/>
                <div className="errorpage_message">
                    An error occurred, please try again.
                </div>

                <Footer/>
            </div>
        )
    }
}