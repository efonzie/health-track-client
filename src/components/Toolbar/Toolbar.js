import React, { Fragment } from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from "react-router-dom";
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import './Toolbar.css';

const toolbar = (props) => {
    let navLinks = (
        <Fragment>
            <LinkContainer to="/signup">
                <NavItem>Signup</NavItem>
            </LinkContainer>
            <LinkContainer to="/login">
                <NavItem>Login</NavItem>
            </LinkContainer>
        </Fragment>
    )

    if (props.isAuthenticated) {
        navLinks = (
            <Fragment>
                <LinkContainer exact to="/">
                    <NavItem>Home</NavItem>
                </LinkContainer>
                <LinkContainer to="/goals">
                    <NavItem>Goals</NavItem>
                </LinkContainer>
                <LinkContainer to="/summary">
                    <NavItem>Summary</NavItem>
                </LinkContainer>
                <LinkContainer to="/configure">
                    <NavItem>Settings</NavItem>
                </LinkContainer>
                <NavItem onClick={props.handleLogout}>Logout</NavItem>
            </Fragment>
        )
    }

    return (
        <Navbar className="Toolbar" fluid collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to="/">Health Track</Link>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight>
                    {navLinks}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default toolbar;