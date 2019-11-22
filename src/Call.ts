import { socket } from "./Network";

const Constraints = {
  audio: true,
  video: {
    height: { min: 400, ideal: 1080 },
    width: { min: 640, ideal: 1920, max: 1920 },
  },
};

const pcConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export class Call {
  private _pc: any = null;
  private _localMediaStream: any = null;
  private _remoteMediaStream: any = null;
  private _localStream: any = null;
  // private _isCaller: boolean = false;

  constructor() {
    this._localMediaStream = document.getElementById(
      "localMedia",
    ) as HTMLMediaElement;
    this._remoteMediaStream = document.getElementById(
      "remoteMedia",
    ) as HTMLMediaElement;
    this._localMediaStream.autoplay = true;
    this._remoteMediaStream.autoplay = true;

    socket.on("answer sdp", (sdp: any) => {
      this._onAnswerSdp(sdp);
    });
    socket.on("offer sdp", (sdp: any) => {
      this._onOfferSdp(sdp);
    });
    socket.on("update candidate", (info: any) => {
      this._updateCandidate(info);
    });
  }

  private _initPC(pc: any, isRemote: boolean = false) {
    pc = new RTCPeerConnection(pcConfig);
    pc.onicecandidate = (event: any) => {
      console.log("icecandidate event: ", event.candidate);
      this._handleConnection(event);
    };
    pc.iceconnectionstatechange = (event: any) => {
      const peerConnection = event.target;
      console.log(
        "iceconnectionstatechange: ",
        peerConnection.iceConnectionState,
      );
    };
    if (isRemote) {
      pc.onaddstream = (event: any) => {
        console.log("remote addtrack");
        this._remoteMediaStream.srcObject = event.stream;
      };
    } else {
      console.log("local pc add stream");
      pc.addStream(this._localStream);
    }
  }

  public start() {
    navigator.mediaDevices
      .getUserMedia(Constraints)
      .then((mediaStream: MediaStream) => {
        this._localMediaStream.srcObject = mediaStream;
        this._localStream = mediaStream;
      })
      .catch((e: any) => {
        alert("getUserMedia() error: " + e.name);
      });
    socket.emit("start", 100);
  }

  public makeCall() {
    console.log("start make call");
    // this._isCaller = true;
    this._initPC(this._pc);
    this._pc
      .createOffer(null)
      .then((description: any) => {
        this.createdOfferSuccess(description);
      })
      .catch((error: any) => {
        console.warn("createOffer error:", error.toString());
      });
  }

  private createdOfferSuccess(description: any) {
    this._pc.setLocalDescription(description);
    this._sendLocalSdp(description);
  }

  private _onAnswerSdp(description: any) {
    this._pc.setRemoteDescription(description);
  }

  private _onOfferSdp(description: any) {
    this._initPC(this._pc, true);
    this._pc.setRemoteDescription(description);
    this._pc
      .createAnswer(null)
      .then((description: any) => {
        this.createAnswerSuccess(description);
      })
      .catch((error: any) => {
        console.warn("createAnswer error:", error.toString());
      });
  }

  private createAnswerSuccess(description: any) {
    this._pc.setLocalDescription(description);
    this._sendRemoteSdp(description);
  }

  private _handleConnection(event: any) {
    if (event.candidate) {
      this._sendIceCandidate({
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      });
    } else {
      console.log("End of candidates.");
    }
  }

  public endCall() {
    if (!this._pc) {
      console.log("Resource has been release");
      return;
    }
    this._pc.close();
    this._pc = null;
    console.log("Call has been ended");
  }

  private _sendLocalSdp(sdp: any) {
    console.log("send local sdp");
    socket.emit("sdp", sdp);
  }

  private _sendRemoteSdp(sdp: any) {
    console.log("send remote sdp");
    socket.emit("sdp", sdp);
  }

  private _sendIceCandidate(info: any) {
    console.log("send remote sdp");
    socket.emit("candidate", info);
  }

  private _updateCandidate(info: any) {
    console.log("recv candidate");
    const candidate = new RTCIceCandidate({
      sdpMLineIndex: info.label,
      candidate: info.candidate,
    });
    this._pc.addIceCandidate(candidate);
  }
}
