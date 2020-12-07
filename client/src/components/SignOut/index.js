import React from 'react';
import { useHistory } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as authActions from '../../store/actions/Auth';
import { useDispatch } from 'react-redux';
import {useCookies} from "react-cookie";

const SignOutButton = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies(['logbook_authUser']);
  const signOut = async () => {
    removeCookie('logbook_authUser')
    await dispatch(authActions.signOut());
    history.push(ROUTES.SIGN_IN);
  };

  return (
    <button className="btn btn-warning" type="button" onClick={signOut}>
      Sign Out
    </button>
  );
};

export default (SignOutButton);
