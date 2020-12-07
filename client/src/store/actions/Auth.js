import * as config from '../../constants/AppConstants';
import { BACKEND_URL } from '../../constants/AppConstants';
import axios from 'axios';
import { getAuthConfig } from './Clients';

export const SET_USERDATA = 'SET_USERDATA';
export const SIGNED_IN = 'SIGNED_IN';
export const SIGNED_OUT = 'SIGNED_OUT';

// Here we fetch all user data and put that into our redux state.
export const fetchUsers = () => {
  return async (dispatch, getState) => {
    const authconfig = getAuthConfig(getState().auth.currentUser.access_token);
    const response = await axios.get(BACKEND_URL + 'users', authconfig);
    if (response.status !== 200) {
      throw new Error('Didnt get 200 response when fetching users');
    }

    dispatch({ type: SET_USERDATA, users: response.data });
  };
};
export const signIn = (authUser = null) => {
  if (authUser === null) {
    // Go off to saml land and try to sign in there.
    console.log('going to saml land')
    window.location.href = BACKEND_URL + 'saml/login';
  }
  return async (dispatch) => {
    // We've already logged in to the idp. Now we are logging in to our react app.
    dispatch({ type: SIGNED_IN, data: authUser });
  };
};

export const signOut = () => {
  return async (dispatch) => {
    dispatch({ type: SIGNED_OUT });
  };
};

export const signUp = (username, email, password) => {
  return async (dispatch) => {
    const data = {
      username: username,
      email: email,
      password: password,
    };
    const response = await axios.post(BACKEND_URL + 'user/signup', data, config.CONFIG_JSON);
    if (response.status !== 200) {
      throw new Error('Didnt get 200 response when signing in');
    }

    if (response.data.success === false) {
      throw new Error(response.data.message);
    }
    // Do a sign in after we sign up.
    dispatch({ type: SIGNED_IN, data: response.data });
  };
};

export const updateRole = (userid, role) => {
  return async (dispatch, getState) => {
    const authconfig = getAuthConfig(getState().auth.currentUser.access_token);
    const data = {
      userid: userid,
      role: role,
    };
    const response = await axios.post(BACKEND_URL + 'user/updaterole', data, authconfig);
    if (response.status !== 200) {
      throw new Error('Didnt get 200 response when updating a user role');
    }
    // Get all the user data to update their roles now that one has changed.
    dispatch(fetchUsers());
  };
};
