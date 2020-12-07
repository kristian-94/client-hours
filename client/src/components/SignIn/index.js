import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import * as ROUTES from '../../constants/routes';
import Landing from '../Landing';
import { connect } from 'react-redux';
import * as authActions from '../../store/actions/Auth';

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: () => dispatch(authActions.signIn()),
  };
};

const SignInPage = props => (
  <div className="text-center">
    <Landing/>
    <SignInForm/>
    <SignUpLink/>
  </div>
);
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    this.props.signIn().then(() => {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push(ROUTES.LANDING);
    })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div>
        <button onClick={this.onSubmit} className="btn btn-primary" type="submit">
          Sign In
        </button>
      </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
)(connect(null, mapDispatchToProps)(SignInFormBase));
export default SignInPage;
export {SignInForm};
