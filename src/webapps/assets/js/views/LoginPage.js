import React, { Component } from 'react';
import '../../css/bootstrap.min.css';
import '../../css/mycss.css';


import LoginForm from "../components/LoginForm";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer"


export default class LoginPage extends React.Component{
    render(){
        return (
            <div>
                <NavigationBar/>
                <LoginForm/>
                <Footer/>
            </div>
        )
    }
}