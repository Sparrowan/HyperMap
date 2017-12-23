//import Cookies from 'js-cookie'
module.exports = {
    //import Cookies from 'js-cookie'
    login: function(username, pass, cb) {
        if (localStorage.token) {
            if (cb) cb(true)
            return
        }
        this.getToken(username, pass, (res) => {
            if (res.authenticated) {
                localStorage.token = res.token
                if (cb) cb(true)
            } else {
                if (cb) cb(false)
            }
        })
    },

    logout: function() {
        delete localStorage.token
    },

    loggedIn: function() {
        //console.log(localStorage.token);
        return !!localStorage.token
    },

    getToken: function(username, pass, cb) {
        fetch('/login/', {
            method: 'POST',
            //credentials: 'include',
            headers: {
                //"X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: pass
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.hasOwnProperty('error')) {
                alert(responseJson.error);
            }
            else {
                cb({
                    authenticated: true,
                    token: responseJson.token
                })
            }
        })
    },
}
