import React from 'react';
import {Route, Switch} from "react-router-dom";
import Login from "./containers/Login/Login";
import Chat from "./containers/Chat/Chat";
import Register from "./containers/Register/Register";

const Routes = () => {
    return (
        <Switch>
            <Route path="/" exact component={Login}/>
            <Route path="/register" exact component={Register}/>
            <Route path="/chat" exact component={Chat}/>
        </Switch>
    );
};

export default Routes;