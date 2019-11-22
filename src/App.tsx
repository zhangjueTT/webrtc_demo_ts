import * as React from "react";
import "./App.css";

import logo from "./logo.svg";
import { Call } from "./Call";

class App extends React.Component {
  private _call: any = null;

  private start = () => {
    if (!this._call) {
      this._call = new Call();
    }
    this._call.start();
  };

  private makeCall = () => {
    this._call.makeCall();
  };

  private endCall = () => {
    this._call.endCall();
  };

  public render() {
    return (
      <div className="Center">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to WebRTC demo</h1>
        </header>

        <div className="App-line">
          <video id="localMedia" className="local-stream-window" />
          <div>
            <video id="remoteMedia" className="remote-stream-window" />
            <div>
              <button className="App-button" onClick={this.start}>
                Start
              </button>
              <button className="App-button" onClick={this.makeCall}>
                Make call
              </button>
              <button className="App-button" onClick={this.endCall}>
                end call
              </button>
            </div>
          </div>
        </div>
        <p className="App-intro" />
      </div>
    );
  }
}

export default App;
