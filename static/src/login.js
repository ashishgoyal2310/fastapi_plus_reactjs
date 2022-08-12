// import React, { useState } from 'react';
// import ReactDOM from 'react-dom';
// import {
//   BrowserRouter,
//   Navigate,
//   Routes,
//   Route,
//   Link
// } from "react-router-dom";


// const Button = () => (
//   <ReactRouterDOM.Route render={({ history }) => (
//     <button type='button' onClick={() => { history.push('/new-location') }}>
//       Click Me!
//     </button>
//   )} />
// )

const AUTH_TOKEN_COOKIE = "authUserToken";

function Home() {
  const authUserToken = $.cookie(AUTH_TOKEN_COOKIE) || null;

  // Declare a new state variable
  const [isAuthUser, setIsAuthUser] = React.useState(!!authUserToken);

  const handleLogout = (event) => {
    $.removeCookie(AUTH_TOKEN_COOKIE);
    setIsAuthUser(null);
  }

  return (
    <>
      {/* Navigate to login if not login */}
      {!isAuthUser && (<ReactRouterDOM.Navigate to="/login" replace={true} />)}
      <div className="text-center">
        <h2>Welcome Guest!!</h2>
      </div>
      <button
        onClick={handleLogout}
        class="btn btn-primary btn-user btn-block">Logout</button>
    </>
  );
}

class LoginComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      isAuthUser: null,
    };
  }

  handleFormChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const formData = {...this.state.formData, [name]: value};

    this.setState(prevState => {
      return {
        ...prevState,
        formData: formData,
      };
    });
  }

  validateFormChange = (event) => {
    const formData = {...this.state.formData};
    let response = {"message": ""}
    return response;
  }

  handleLoginFormSubmit = (event) => {
    event.preventDefault();
    const { formData } = this.state;

    const validData = this.validateFormChange()
    if (validData["message"]) {
      alert("Invalid form data. " + validData["message"]);
      return false;
    }

    var ajaxSettings = {
      "url": "/api/accounts/login",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "async": false,
      "data": JSON.stringify(formData)
    };

    let authUserToken = null;
    $.ajax(ajaxSettings
      ).done(function(response, textStatus, jqXHR) {
        console.log(response, textStatus, jqXHR);
        authUserToken = response.api_key || null;

      }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
        if (jqXHR.responseJSON && jqXHR.responseJSON.detail) {
          alert(jqXHR.responseJSON.detail);
        }
      });

    $.cookie(AUTH_TOKEN_COOKIE, authUserToken, {
      expires: 1, // Expires in 10 days
      path: '/',  // The value of the path attribute of the cookie
                  // (Default: path of page that created the cookie)
    })
    this.setState(prevState => {
      return {
        ...prevState,
        isAuthUser: !!authUserToken,
      };
    });
  }

  render() {
    let { isAuthUser } = this.state;

    return (
      <>
        {/* Navigate to dashboard if already login */}
        {isAuthUser && (<ReactRouterDOM.Navigate to="/" replace={true} />)}
        <div class="text-center">
            <h1 class="h4 text-gray-900 mb-4">Login!</h1>
        </div>
        <form class="user" onSubmit={(event) => this.handleLoginFormSubmit(event)} method="post">
            <div class="form-group">
                <input
                  type="email"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleFormChange}
                  class="form-control form-control-user" aria-describedby="emailHelp"
                  placeholder="Enter Email Address..." required />
            </div>
            <div class="form-group">
                <input
                  type="password"
                  name="password"
                  value={this.state.email}
                  onChange={this.handleFormChange}
                  class="form-control form-control-user"
                  placeholder="Password" required />
            </div>
            <div class="form-group">
                <div class="custom-control custom-checkbox small">
                    <input type="checkbox" class="custom-control-input" id="customCheck" />
                    <label class="custom-control-label" htmlFor="customCheck">Remember Me</label>
                </div>
            </div>
            <input type="submit" class="btn btn-primary btn-user btn-block" value="Login" />
        </form>
        <hr />
        <div>
          <NavLink name="Forgot Password?" url="/forgot-password" />
          <NavLink name="Create an Account!" url="/register" />
        </div>
      </>
    );
  }
}

class RegisterComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {}
    };
  }

  handleFormChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const formData = {...this.state.formData, [name]: value};

    this.setState(prevState => {
      return {
        ...prevState,
        formData: formData,
      };
    });
  }

  validateFormChange = (event) => {
    const formData = {...this.state.formData};
    let response = {"message": ""}

    if (!formData.password) {
      response["message"] = 'password missing.'
    } else if ((formData.password || formData.repeat_password) && (formData.password != formData.repeat_password)) {
        response["message"] = 'repeat password should be same.'
    }

    return response;
  }

  handleRegisterFormSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.formData)

    const validData = this.validateFormChange()
    if (validData["message"]) {
      alert("Invalid form data. " + validData["message"]);
      return false;
    }

    var ajaxSettings = {
      "url": "/api/accounts/register",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify(this.state.formData)
    };

    $.ajax(ajaxSettings
      ).done(function(response, textStatus, jqXHR) {
        console.log(response, textStatus, jqXHR);
      }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
      });
  }

  render() {
    return (
      <>
        <div class="text-center">
            <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
        </div>
        <form class="user" onSubmit={(event) => this.handleRegisterFormSubmit(event)} method="post">
            <div class="form-group row">
                <div class="col-sm-6 mb-3 mb-sm-0">
                    <input
                      type="text"
                      name="first_name"
                      value={this.state.first_name}
                      onChange={this.handleFormChange}
                      class="form-control form-control-user" placeholder="First Name" required />
                </div>
                <div class="col-sm-6">
                    <input
                      type="text"
                      name="last_name"
                      value={this.state.last_name}
                      onChange={this.handleFormChange}
                      class="form-control form-control-user" placeholder="Last Name" required />
                </div>
            </div>
            <div class="form-group">
                <input
                  type="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleFormChange}
                  class="form-control form-control-user" placeholder="Email Address" required />
            </div>
            <div class="form-group row">
                <div class="col-sm-6 mb-3 mb-sm-0">
                    <input
                      type="password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleFormChange}
                      class="form-control form-control-user" placeholder="Password" />
                </div>
                <div class="col-sm-6">
                    <input
                      type="password"
                      name="repeat_password"
                      value={this.state.repeat_password}
                      onChange={this.handleFormChange}
                      class="form-control form-control-user" placeholder="Repeat Password" />
                </div>
            </div>
            <input type="submit" class="btn btn-primary btn-user btn-block" value="Register Account" />
        </form>
        <hr />
        <div>
          <NavLink name="Forgot Password?" url="/forgot-password" />
          <NavLink name="Already have an account? Login!" url="/login" />
        </div>
      </>
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
