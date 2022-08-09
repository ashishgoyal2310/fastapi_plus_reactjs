// import React from 'react';
// import ReactDOM from 'react-dom';

function Question(props) {
  return <span className="question">{props.value}</span>
}

function QuestionOption(props) {
  return <button className="col-md-6 option" onClick={() => props.onClick()}>{props.value}</button>
}

class QuestionAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quests: [
        {
          "question": "this is sample question 1, this is sample question 1 this is sample question 1" +
          "this is sample question 1 this is sample question 1 this is sample question 1",
          "options": ["option 1", "option 2", "option 3", "option 4"]
        },
        {
          "question": "this is sample question 2",
          "options": ["option 1", "option 2", "option 3", "option 4"]
        }
      ],
      // next question number from quests
      next: 0,

      // countdown to attempt question
      countdowntToAttempt: 0, // default 10 seconds
      intervalAttemptId: 0,

      countdowntToAnswer: 0,
      secondsToAnswer: 0,
      score: 0,

      // countdown to display next question
      countdownToNext: 'Start', // default 5 seconds
      intervalNextId: 0,
    };
  }

  handleClick = (i) => {
    console.log("clicked " + i);
    const endTime = new Date().getTime();
    const secondsToAnswer = (endTime - this.state.countdowntToAnswer)/1000;
    const score = this.state.score + secondsToAnswer
    this.setState(prevState => {
      return {
        ...prevState,
        secondsToAnswer: secondsToAnswer,
        score: score,
      };
    });
  }

  handleCountdowntToAttempt = () => {
    const startTime = new Date().getTime();

    // clearInterval if already exists
    if(this.state.intervalAttemptId) {
      clearInterval(this.state.intervalAttemptId);
    }

    // reset the interval id countdown to 10 seconds
    this.setState(prevState => {
      return {
        ...prevState,
        countdowntToAttempt: 10,
        intervalAttemptId: 0,

        countdowntToAnswer: startTime,
        secondsToAnswer: 0,
      };
    });

    // setInterval to update countdown
    const newintervalAttemptId = setInterval(() => {
      console.log('handleCountdowntToAttempt: ' + this.state.countdowntToAttempt);

      // clearInterval if countdown is zero in between
      if(this.state.intervalAttemptId && this.state.countdowntToAttempt <= 1) {
        clearInterval(this.state.intervalAttemptId);

        const countdownToNext = (this.state.next < this.state.quests.length-1) ? "Next" : "Finish";
        this.setState(prevState => {
          return {
            ...prevState,
            countdownToNext: countdownToNext,
            next: prevState.next+1,
          };
        });
      }

      this.setState(prevState => {
        return {
          ...prevState,
          countdowntToAttempt: prevState.countdowntToAttempt - 1,
        };
      });
    }, 1000);

    // set interval id to state
    this.setState(prevState => {
      return {
        ...prevState,
        intervalAttemptId: newintervalAttemptId,
      };
    });
  }

  handleCountdownToNext = () => {
    // clearInterval if already exists
    if(this.state.intervalNextId) {
      clearInterval(this.state.intervalNextId);
    }

    // reset the interval id countdown to 10 seconds
    this.setState(prevState => {
      return {
        ...prevState,
        countdownToNext: 5,
        intervalNextId: 0,
      };
    });

    // setInterval to update countdown
    const newintervalNextId = setInterval(() => {
      console.log('handleCountdownToNext: ' + this.state.countdownToNext);

      // clearInterval if countdown is zero in between
      if(this.state.intervalNextId && this.state.countdownToNext <= 1) {
        clearInterval(this.state.intervalNextId);
        console.log('call handleCountdowntToAttempt to reset the countdown to attempt.')
        this.handleCountdowntToAttempt();
      }

      this.setState(prevState => {
        return {
          ...prevState,
          countdownToNext: prevState.countdownToNext - 1,
        };
      });
    }, 1000);

    // set interval id to state
    this.setState(prevState => {
      return {
        ...prevState,
        intervalNextId: newintervalNextId,
      };
    });
  }

  renderOption = (i) => {
    let questionData = this.state.quests[this.state.next];
    return (
      <QuestionOption
        key={i}
        value={questionData.options[i]}
        onClick={() => this.handleClick(i)}
        />
    );
  }

  renderQuest = () => {
    let questState = String(this.state.countdownToNext).toLowerCase();
    if ((questState == 'start') || (questState == 'next')) {
      return (
        <button onClick={() => this.handleCountdownToNext()}>{this.state.countdownToNext}</button>
      )
    } else if (questState == 'finish') {
      return (
        <span>Completed (score: {this.state.score})</span>
      )
    } else if (this.state.countdownToNext > 0) {
      return (
        <span>Next question in {this.state.countdownToNext} seconds.</span>
      )
    } else {
      let questionData = this.state.quests[this.state.next];
      let row1 = []
      for (let i=0; i<questionData.options.length; i++) { row1.push(this.renderOption(i)) };

      return (
        <div>
          <div>Time Left: {this.state.countdowntToAttempt}</div>
          <Question value={questionData.question} />
          <div>
            { row1 }
          </div>
          <div>
            {this.state.secondsToAnswer}
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <h2>Quest</h2>
        </div>
        <div className="col-md-12 card card-body">
          {this.renderQuest()}
        </div>
      </div>
    )
  }
}

// export default QuestionAnswer;