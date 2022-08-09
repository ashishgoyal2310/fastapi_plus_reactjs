// import React from 'react';
// import ReactDOM from 'react-dom';;
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link
// } from "react-router-dom";

function NavLink(props) {
  return (
    <li style={{"listStyle": "none", "backgroundColor": "#fff", "padding": "0rem 1rem", "margin": "0 1rem"}}>
      <ReactRouterDOM.Link to={ props.url }>{ props.name }</ReactRouterDOM.Link>
    </li>
  );
}

function App() {
  return (
    <ReactRouterDOM.BrowserRouter>
      <div>
        <nav>
          <ul style={{"display": "flex", "flexDirection": "row", "backgroundColor": "#4167d5", "padding": "0.75rem"}}>
            <NavLink name="Home" url="/" />
            <NavLink name="Tambola" url="/tambola" />
            <NavLink name="TicTacToe" url="/tictactoe" />
            <NavLink name="Quest" url="/quest" />
          </ul>
        </nav>

        {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <ReactRouterDOM.Routes>
          <ReactRouterDOM.Route path="/" element={<Home />} />
          <ReactRouterDOM.Route path="/tambola" element={<TambolaGameBoard />} />
          <ReactRouterDOM.Route path="/tictactoe" element={<TicTacToeGame />} />
          <ReactRouterDOM.Route path="/quest" element={<QuestionAnswer />} />
        </ReactRouterDOM.Routes>
      </div>
    </ReactRouterDOM.BrowserRouter>
  );
}

// export default App;