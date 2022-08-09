// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// define(function (require) {
//   // Load any app-specific modules
//   // with a relative require call,
//   // like:
//   var App = require('./App');

//   // print(messages.getHello());
//   const element = (
//     <div>
//       <h1>Hello Stranger!!</h1>
//       <React.StrictMode>
//         <App />
//       </React.StrictMode>
//     </div>
//   );

//   const domContainer = document.getElementById('root');
//   const root = ReactDOM.createRoot(domContainer);
//   root.render(element);

// });

// function Home() {
//   return <h2>Welcome !!</h2>;
// }

function MemberName(props) {
  return (
    <div>
      {props.name}
      <button onClick={() => props.onClick()}>Remove</button>
    </div>
  )
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    const total = 0;
    this.state = {
      names: Array(total).fill('--'),
    };
  }

  renderTeamMember = () => {
    const names = this.state.names;
    let nameDiv = []
    for (let i=0; i<names.length; i++) {
      nameDiv.push(
        <MemberName key={i} name={names[i]} onClick={() => this.handleRemoveClick(names[i])} />
      )
    }
    return (
      <div>
        {nameDiv}
      </div>
    )
  }

  handleRemoveClick = (nameToRemove) => {
    const names = this.state.names.slice();
    names.splice( $.inArray(nameToRemove, names), 1 );
    this.setState({names: names});
  };

  textInput = React.createRef();  // React use ref to get input value
  handleAddClick = () => {
    const names = this.state.names.slice();
    names.push(this.textInput.current.value);

    if (!!this.textInput.current.value) {
      this.setState(prevState => {
        return {
          ...prevState,
          names: names,
        };
      });
    }
    this.textInput.current.value = '';
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <h2>Manage Users</h2>
        </div>
        <div className="col-6 card card-body">
          <input type="text" placeholder="member name" ref={this.textInput} />
          <button onClick={() => this.handleAddClick()}>Add New</button>
          <h4>Members</h4>
          {this.renderTeamMember()}
        </div>
      </div>
    );
  }
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
