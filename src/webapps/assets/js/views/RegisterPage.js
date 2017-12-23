import React from 'react';
import '../../css/bootstrap.min.css';
import '../../css/mycss.css';


import RegisterForm from "../components/RegisterForm";
import NavigationBarSignup from "../components/NavigationBar_signin";

export default class LoginPage extends React.Component{
    render(){
        return (
            <div>
                <NavigationBarSignup/>
                <RegisterForm/>
            </div>
        )
    }
}