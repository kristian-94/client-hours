import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as NAMES from '../../constants/names';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useSelector, useDispatch } from 'react-redux';
import {useCookies} from "react-cookie";
import * as authActions from "../../store/actions/Auth";

const Navigation = () => {
  const dispatch = useDispatch();
  const [cookies] = useCookies(['logbook_authUser']);
  useEffect(() => {
    // See if we can get the user details from the cookie.
    const authUser = cookies.logbook_authUser;
    if (authUser) {
      // Sign in to the react app. Set auth details in redux and make sure they're saved in local storage.
      dispatch(authActions.signIn(authUser));
    }
  }, [cookies, dispatch]);
  const authUser = useSelector(state => state.auth.currentUser);
  if (authUser === null || authUser === [] || authUser === undefined) {
    return <NavigationNonAuth/>;
  }

  if (authUser.role === 3) {
    return <NavigationAdminAuth authUser={authUser}/>;
  }

  if (authUser.role === 1) {
    return <NavigationBasicAuth authUser={authUser}/>;
  }

  return <NavigationNonAuth/>;
};

const NavigationAdminAuth = ({ authUser }) => {
  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand to="/">{NAMES.SITENAME}</Navbar.Brand>
      <Nav className="mr-auto">
        <Link className="btn btn-danger ml-1 mr-1" to={ROUTES.CLIENTADMIN}>
          Client Admin
        </Link>
        <Link className="btn btn-danger ml-1 mr-1" to={ROUTES.LOGS}>
          Logs
        </Link>
        <Link className="btn btn-success ml-1 mr-1" to={ROUTES.CLIENTS}>
          View Clients
        </Link>
        <Link className="btn btn-success ml-1 mr-1" to={ROUTES.REPORT}>
          Reports
        </Link>
        <Link className="btn btn-success ml-1 mr-1" to={ROUTES.SUMMARY}>
          Client Summary
        </Link>
      </Nav>
      <Navbar.Brand to="/">You are <strong>{authUser.username}</strong></Navbar.Brand>
      <Link className="btn btn-primary" to={ROUTES.ADMIN}>
        Admin
      </Link>
      <Link className="btn btn-primary" to={ROUTES.ACCOUNT}>
        Account
      </Link>
      <SignOutButton/>
    </Navbar>
  );
};

const NavigationBasicAuth = ({ authUser }) => (
  <Navbar bg="primary" variant="dark">
    <Navbar.Brand to="/">{NAMES.SITENAME}</Navbar.Brand>
    <Nav className="mr-auto">
      <Link className="btn btn-success ml-1 mr-1" to={ROUTES.CLIENTS}>
        Clients
      </Link>
      <Link className="btn btn-success ml-1 mr-1" to={ROUTES.REPORT}>
        Reports
      </Link>
      <Link className="btn btn-success ml-1 mr-1" to={ROUTES.SUMMARY}>
        Client Summary
      </Link>
    </Nav>
    <Link className="btn btn-primary" to={ROUTES.ACCOUNT}>
      Account
    </Link>
    <SignOutButton/>
  </Navbar>
);

const NavigationNonAuth = () => (
  <Navbar bg="primary" variant="dark">
    <Navbar.Brand to="/">{NAMES.SITENAME}</Navbar.Brand>
    <Nav className="mr-auto">
      <Link className="btn btn-primary" to={ROUTES.LANDING}>
        Landing
      </Link>
      <Link className="btn btn-primary" to={ROUTES.SIGN_IN}>
        Sign In
      </Link>
    </Nav>
  </Navbar>
);
export default Navigation;
