import React, { Component } from "react";
import { PionEvents, PionSession } from "pion-browser-client";
import adapter from "webrtc-adapter";
import logo from "./logo.svg";
import "./App.css";

const SIGNALER_URI = "localhost:5001";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sources: [],
    };

    navigator.getUserMedia(
      {
        video: true,
        audio: true,
      },
      (localMediaStream) => {
        let localVideo = document.getElementById("localVideo");
        localVideo.srcObject = localMediaStream;
        localVideo.onloadedmetadata = function (e) {
          localVideo.play();
        };

        let pionSession = new PionSession(SIGNALER_URI, "", {
          iceServers: [
            {
              urls: "stun:localhost",
            },
          ],
          mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true },
        });

        pionSession.eventHandler = (event) => {
          switch (event.type) {
            case PionEvents.MEDIA_START:
              this.setState({
                sources: this.state.sources.concat([event.media]),
              });

              break;
            case PionEvents.MEDIA_STOP:
              const idx = this.state.sources.find(
                (media) => event.media.id === media.id
              );

              const sources = this.state.sources;
              sources.splice(idx, 1);

              this.setState({
                sources,
              });

              break;
            default:
              console.warn(event);
          }
        };
        pionSession.start();
        pionSession.addMedia(localMediaStream);
      },
      function (err) {
        console.log(
          "The following error occurred when trying to use getUserMedia: " + err
        );
      }
    );
  }

  componentDidUpdate() {
    this.state.sources.forEach((media) => {
      const videoElem = document.getElementById(media.id);
      videoElem.srcObject = media;
      videoElem.onloadedmetadata = function (e) {
        videoElem.play();
      };
    });
  }

  render() {
    return (
      <div className="App">
        <video id="localVideo" controls muted />
        <div id="remoteVideos">
          {this.state.sources.map((media) => (
            <video id={media.id} controls />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
