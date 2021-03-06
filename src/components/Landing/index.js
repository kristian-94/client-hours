import React from 'react';
import {useSelector} from "react-redux";

const Landing = () => {
    const authUser = useSelector(state => state.auth.currentUser);
    if (authUser === null || !authUser) {
        return <NonAuth />
    }
    if (authUser.role  === 3 || authUser.role  === 1) {
        return <Auth authUser={authUser} />
    }
    return <NonAuth />
};
export default Landing;

const NonAuth = () => {
    return (
        <div className="text-center mt-2">
            <h4>Please sign in</h4>
        </div>
    );
}

const Auth = ({authUser}) => {
    return (
        <div className="text-center mt-5">
            <h1>Hello <strong>{authUser.username}</strong></h1>
            <h5>Use the links at the top to view client hours information.</h5>
        </div>
    );
}
