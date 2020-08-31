import React, { Component } from "react";
import "./CodeEntry.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  }

  handleSubmit() {
    this.props.onSubmitCode(this.inputRef.current.value);
  }

  render() {
    return (
      <div id="CodeEntry">
        <input
          ref={this.inputRef}
          type="text"
          placeholder="••••"
          onKeyUp={this.handleKeyUp}
        />
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}

export default App;
