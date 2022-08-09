// import React from 'react';
// import ReactDOM from 'react-dom';

function Square(props) {
  return (
    <button className={`square ${props.value}`} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class TambolaGameBoard extends React.Component {
  constructor(props) {
    super(props);
    const total = 30;
    this.state = {
      numbers: Array(total).fill().map((_, idx) => 0 + idx),
      currentnumber: null,
      squares: Array(total).fill('--'),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = ("000" + i).slice(-2);
    this.setState({squares: squares});
  }

  showNextNumber() {
    // get a copy of number list
    const numbers = this.state.numbers.slice();
    // pick random number from number list
    let currentnumber = numbers[Math.floor(Math.random()*numbers.length)];;
    // remove choosen number from number list
    numbers.splice( $.inArray(currentnumber, numbers), 1 );
    // update number list and current number in state
    currentnumber = currentnumber>=0 ? currentnumber : 'XX'
    this.setState({currentnumber: currentnumber, numbers: numbers});
    this.handleClick(currentnumber);
  }

  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    var row1 = [], start = 0;
    for (let i=start; i<start+10; i++) { row1.push(this.renderSquare(i)) }
    var row2 = [], start = 10;
    for (let i=start; i<start+10; i++) { row2.push(this.renderSquare(i)) }
    var row3 = [], start = 20;
    for (let i=start; i<start+10; i++) { row3.push(this.renderSquare(i)) }
    return (
      <div className="row">
        <div className="col-md-12">
          <h2>Tambola</h2>
        </div>
        <div className="col-xs-2">
          <button className="big-square" onClick={() => this.showNextNumber()}>
            <span>{this.state.currentnumber}</span>
            <br />
            NEXT
          </button>
        </div>
        <div className="col-xs-10">
          <div className="board">
            {row1}
          </div>
          <div className="board">
            {row2}
          </div>
          <div className="board">
            {row3}
          </div>
        </div>
      </div>
    )
  }
}

// export default TambolaGameBoard;