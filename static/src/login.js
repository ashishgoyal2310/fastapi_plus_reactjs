// import React from 'react';
// import ReactDOM from 'react-dom';
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link
// } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="text-center">
        <h2>Welcome Guest!!</h2>
      </div>
      <NavLink name="Already have an account? Login!" url="/login" />
    </>
  );
}

class LoginComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleLoginClick = () => {
    console.log("clicked");
    this.props.history.push("path/to/push");
  }

  render() {
    return (
      <div>
        <div class="text-center">
            <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
        </div>
        <form class="user">
            <div class="form-group">
                <input type="email" class="form-control form-control-user"
                    id="exampleInputEmail" aria-describedby="emailHelp"
                    placeholder="Enter Email Address..." />
            </div>
            <div class="form-group">
                <input type="password" class="form-control form-control-user"
                    id="exampleInputPassword" placeholder="Password" />
            </div>
            <div class="form-group">
                <div class="custom-control custom-checkbox small">
                    <input type="checkbox" class="custom-control-input" id="customCheck" />
                    <label class="custom-control-label" htmlFor="customCheck">Remember Me</label>
                </div>
            </div>
            <button class="btn btn-primary btn-user btn-block" onClick={() => this.handleLoginClick()} type="button">Login</button>
        </form>
        <hr />
        <div>
          <NavLink name="Forgot Password?" url="/forgot-password" />
          <NavLink name="Create an Account!" url="/register" />
        </div>
      </div>
    );
  }
}

class RegisterComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <div class="text-center">
            <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
        </div>
        <form class="user">
            <div class="form-group row">
                <div class="col-sm-6 mb-3 mb-sm-0">
                    <input type="text" class="form-control form-control-user" id="exampleFirstName" placeholder="First Name" />
                </div>
                <div class="col-sm-6">
                    <input type="text" class="form-control form-control-user" id="exampleLastName" placeholder="Last Name" />
                </div>
            </div>
            <div class="form-group">
                <input type="email" class="form-control form-control-user" id="exampleInputEmail" placeholder="Email Address" />
            </div>
            <div class="form-group row">
                <div class="col-sm-6 mb-3 mb-sm-0">
                    <input type="password" class="form-control form-control-user" id="exampleInputPassword" placeholder="Password" />
                </div>
                <div class="col-sm-6">
                    <input type="password" class="form-control form-control-user" id="exampleRepeatPassword" placeholder="Repeat Password" />
                </div>
            </div>
            <a href="login.html" class="btn btn-primary btn-user btn-block">
                Register Account
            </a>
        </form>
        <hr />
        <div>
          <NavLink name="Forgot Password?" url="/forgot-password" />
          <NavLink name="Already have an account? Login!" url="/login" />
        </div>
      </div>
    );
  }
}

class ForgotPwdComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <div class="text-center">
            <h1 class="h4 text-gray-900 mb-2">Forgot Your Password?</h1>
            <p class="mb-4">We get it, stuff happens. Just enter your email address below
                and we'll send you a link to reset your password!</p>
        </div>
        <form class="user">
            <div class="form-group">
                <input type="email" class="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address..." />
            </div>
            <NavLinkBtn name="Reset Password" url="/reset-password" />
        </form>
        <hr />
        <div>
          <NavLink name="Create an Account!" url="/register" />
          <NavLink name="Already have an account? Login!" url="/login" />
        </div>
      </div>
    );
  }
}

class ResetPwdComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <div class="text-center">
            <h1 class="h4 text-gray-900 mb-2">Reset Password</h1>
        </div>
        <form class="user">
            <div class="form-group row">
                <div class="col-sm-6 mb-3 mb-sm-0">
                    <input type="password" class="form-control form-control-user" id="exampleInputPassword" placeholder="Password" />
                </div>
                <div class="col-sm-6">
                    <input type="password" class="form-control form-control-user" id="exampleRepeatPassword" placeholder="Repeat Password" />
                </div>
            </div>
            <a href="login.html" class="btn btn-primary btn-user btn-block">
                Reset Password
            </a>
        </form>
        <hr />
        <div>
          <NavLink name="Already have an account? Login!" url="/login" />
        </div>
      </div>
    );
  }
}

function NavLink(props) {
  return (
    <div className="text-center">
      <ReactRouterDOM.Link className="small" to={ props.url }>{ props.name }</ReactRouterDOM.Link>
    </div>
  );
}

function NavLinkBtn(props) {
  return (
    <ReactRouterDOM.Link className="btn btn-primary btn-user btn-block" to={ props.url }>{ props.name }</ReactRouterDOM.Link>
  );
}

function App() {
  return (
    <ReactRouterDOM.BrowserRouter>
        {/* <NavLink name="Already have an account? Login!" url="/login" />
        <NavLink name="Create an Account!" url="/register" />
        <NavLink name="Forgot Password?" url="/forgot-password" />
        <NavLink name="Reset Password?" url="/reset-password" /> */}

        {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <ReactRouterDOM.Routes>
          <ReactRouterDOM.Route path="/" element={<Home />} />
          <ReactRouterDOM.Route path="/login" element={<LoginComp />} />
          <ReactRouterDOM.Route path="/register" element={<RegisterComp />} />
          <ReactRouterDOM.Route path="/forgot-password" element={<ForgotPwdComp />} />
          <ReactRouterDOM.Route path="/reset-password" element={<ResetPwdComp />} />
        </ReactRouterDOM.Routes>
    </ReactRouterDOM.BrowserRouter>
  );
}

const element = (
<div>
    <React.StrictMode>
    <App />
    </React.StrictMode>
</div>
);

const domContainer = document.getElementById('root');
const root = ReactDOM.createRoot(domContainer);
root.render(element);
