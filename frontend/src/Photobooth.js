import React, { Component } from "react";
import { PionEvents, PionSession } from "pion-browser-client";
import adapter from "webrtc-adapter";
import logo from "./logo.svg";
import "./Photobooth.css";

const SIGNALER_URI = "localhost:5001";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sources: [],
    };
  }

  componentDidMount() {
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

        // TODO: Look into second parameter for room code
        let pionSession = new PionSession(SIGNALER_URI, this.props.room, {
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
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
    const numVideos = this.state.sources.length + 1;
    const cols = Math.ceil(Math.sqrt(numVideos));
    const rows = Math.ceil(numVideos / cols);

    return (
      <div id="Photobooth">
        <div
          id="videos"
          style={{
            gridTemplateColumns: "repeat(" + cols + ", 1fr)",
            gridTemplateRows: "repeat(" + rows + ", minmax(0, 1fr))",
          }}
        >
          <div className="video-container">
            <video id="localVideo" controls={false} muted />
          </div>
          {this.state.sources.map((media) => (
            <div className="video-container">
              <video id={media.id} controls={false} />
            </div>
          ))}
        </div>
        <div id="bar">
          <button id="capture-button">Take Photo</button>
        </div>
      </div>
    );
  }
}

export default App;
