import { SET_USERDATA, SIGNED_IN, SIGNED_OUT } from '../actions/Auth';

const localdata = JSON.parse(localStorage.getItem('authUser'));
let user = [];
if (localdata) {
  user = localdata;
}

const initialState = {
  users: [],
  adminUsers: [],
  currentUser: user,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USERDATA:
      // Add the adminUsers also to a second object for easy querying.
      const admins = action.users.filter((user) => user.role === 3);
      return {
        ...state,
        users: action.users,
        adminUsers: admins,
      };
    case SIGNED_IN:
      // We just signed in so store our token in local storage and in redux state.
      const currentuser = action.data;
      localStorage.setItem('authUser', JSON.stringify(currentuser));
      return {
        ...state,
        currentUser: currentuser,
      };
    case SIGNED_OUT:
      // We just signed out so delete our token in local storage and in redux state.
      localStorage.removeItem('authUser');
      return {
        ...state,
        currentUser: [],
      };
    default:
      return state;
  }
};
