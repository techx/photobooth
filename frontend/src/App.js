import React, { Component } from "react";
import "./App.css";

import CodeEntry from "./CodeEntry";
import Photobooth from "./Photobooth";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
    };
  }

  handleSubmitCode = (code) =>
    this.setState({
      code,
    });

  render() {
    return (
      <div id="App">
        {this.state.code.length === 0 ? (
          <CodeEntry onSubmitCode={this.handleSubmitCode} />
        ) : (
          <Photobooth room={this.state.code} />
        )}
      </div>
    );
  }
}

export default App;
