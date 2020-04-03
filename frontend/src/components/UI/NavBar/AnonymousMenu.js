import React from 'react';
import {NavItem, NavLink} from "reactstrap";
import {NavLink as RouterNavLink} from "react-router-dom";

const AnonymousMenu = () => (
    <>
        <NavItem>
            <NavLink tag={RouterNavLink} to="/register" exact>Sign Up</NavLink>
        </NavItem>
        <NavItem>
            <NavLink tag={RouterNavLink} to="/" exact>Login</NavLink>
        </NavItem>
    </>
);

export default AnonymousMenu;