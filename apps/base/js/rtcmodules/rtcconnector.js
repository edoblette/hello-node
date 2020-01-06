/**
* @nocollapse
* @export
*/
class Rtc {
    constructor(adress) {

	  	this.localConnection = null;   // RTCPeerConnection for our "local" connection
	  	this.remoteConnection = null;  // RTCPeerConnection for the "remote"
	  
	  	this.sendChannel = null;       // RTCDataChannel for the local (sender)
	  	this.receiveChannel = null;    // RTCDataChannel for the remote (receiver)
  		this.return_adress = adress ;

	  	this.LauchPeers()
	  	//this.invite()
	  	

	}
   
  // Functions
  
	async sendToServer(msg) {
		alert("send to server")
		await Comm.get("Offer/" + this.myUsername + '/' + this.targetUsername );
	}

   LauchPeers() {
    // Create the local connection and its event listeners
    
    this.localConnection = new RTCPeerConnection();

	this.localConnection.onicecandidate = e => {
	    if (e.candidate) {
	      this.sendToServer({'candidate': e.candidate});
	    }
	};

	
    // Create the data channel and establish its event listeners
    this.sendChannel = this.localConnection.createDataChannel("message");
    this.sendChannel.onopen = e => this.handlesendChannelStatusChange(e);
    this.sendChannel.onclose = e => this.handlesendChannelStatusChange(e);
    this.sendChannel.ondatachannel = e  => this.receiveChannelCallback(e);
	
    console.log("DONE")

 
  }

  async Signal_Negociation(){
  	    this.localConnection.onicecandidate = e => !e.candidate
        //|| this.remoteConnection.addIceCandidate(e.candidate)
        .catch(this.handleAddCandidateError);
  }

  async CreateOffer(){

  	this.localConnection.onnegotiationneeded = function() {
	  this.localConnection.createOffer().then(function(offer) {
	    return this.localConnection.setLocalDescription(offer);
	  })
	  .then(function() {
	    console.log("Ayoi")
	    });
	}

  	this.localConnection.createOffer()
  	.then(offer => this.localConnection.setLocalDescription(offer))
  	let result = await Comm.get("Offer/" + this.myUsername + '/' + this.targetUsername ); // wait data from server
	return result.response;
	  
  	this.localConnection.ondatachannel = e => this.receiveChannelCallback(e);


  }

  ReceiveOffer(){

  }
    
  // Handle errors attempting to create a description;
  // this can happen both when creating an offer and when
  // creating an answer. In this simple example, we handle
  // both the same way.
  
  handleCreateDescriptionError(error) {
    console.log("Unable to create an offer: " + error.toString());
  }
  
  // Handle successful addition of the ICE candidate
  // on the "local" end of the connection.
  
  handleLocalAddCandidateSuccess() {
    connectButton.disabled = true;
  }

  // Handle successful addition of the ICE candidate
  // on the "remote" end of the connection.
  
  handleRemoteAddCandidateSuccess() {
    disconnectButton.disabled = false;
  }

  // Handle an error that occurs during addition of ICE candidate.
  
  handleAddCandidateError() {
    console.log("Oh noes! addICECandidate failed!");
  }

  // Handles clicks on the "Send" button by transmitting
  // a message to the remote peer.
  
   sendMessage(message) {
  	alert("activated " + message);
    this.sendChannel.send(message);
    
  }
  
  // Handle status changes on the local end of the data
  // channel; this is the end doing the sending of data
  // in this example.
  
  handlesendChannelStatusChange(event) {
    if (this.sendChannel) {
      this.state = this.sendChannel.readyState;
    
      if (this.state === "open") {
    	console.log("OPEN")
      } else {
       console.log("NOT OPEN")
      }
    }
  }
  
  // Called when the connection opens and the data
  // channel is ready to be connected to the remote.
  
  receiveChannelCallback(event) {
    this.receiveChannel = event.channel;
    this.receiveChannel.onmessage = e => this.handleReceiveMessage(e);
    this.receiveChannel.onopen = e => this.handlesendChannelStatusChange(e);
    this.receiveChannel.onclose = e => this.handlesendChannelStatusChange(e);
  }
  
  // Handle onmessage events for the receiving channel.
  // These are the data messages sent by the sending channel.
  
  handleReceiveMessage(event) {
  	this.return_adress.ReceiveMessageToRtc(event.data);
  	console.log("receive " + event.data)
  	/*
    this.el = document.createElement("p");
    this.txtNode = document.createTextNode(event.data);
    
    el.appendChild(txtNode);
    receiveBox.appendChild(el);
    */
  }
  
  // Handle status changes on the receiver's channel.
  
  handleReceiveChannelStatusChange(event) {
    if (this.receiveChannel) {
      console.log("Receive channel's status has changed to " +
                  this.receiveChannel.readyState);
    }
    
    // Here you would do stuff that needs to be done
    // when the channel's status changes.
  }
  
  // Close the connection, including data channels if they're open.
  // Also update the UI to reflect the disconnected status.
  
  disconnectPeers() {
  
    // Close the RTCDataChannels if they're open.
    
    this.sendChannel.close();
    receiveChannel.close();
    
    // Close the RTCPeerConnections
    
    this.localConnection.close();
    this.remoteConnection.close();

    this.sendChannel = null;
    receiveChannel = null;
    this.localConnection = null;
    this.remoteConnection = null;
    

  }


}

/*
	async invite() {
	 	var mediaConstraints = {
		  audio: true, // We want an audio track
		  video: true // ...and we want a video track
		};

	  if (this.localConnection) {
	    alert("You can't start a call because you already have one open!");
	  } else {
	    var clickedUsername = this.targetUsername;

	    if (clickedUsername === this.myUsername) {
	      alert("I'm afraid I can't let you talk to yourself. That would be weird.");
	      return;
	    }

	   
	    await this.connect_video_peer();
	    console.log(this.localConnection);

	    navigator.mediaDevices.getUserMedia(mediaConstraints)
	    .then(function(localStream) {
	      document.getElementById("local_video").srcObject = localStream;
	      console.log(localStream.getTracks())
	      localStream.getTracks().forEach(track => this.localConnection.addTrack(track, localStream));
	    })
	    .catch(this.handleGetUserMediaError);
	  }
	}

	async connect_video_peer(){
	  	// Create the local connection and its event listeners
	    this.localConnection = new RTCPeerConnection({
		      iceServers: [     // Information about ICE servers - Use your own!
		        {
		          urls:"stun:stun.l.google.com:19302"
		        }
		      ]
		});

		this.localConnection.onicecandidate = this.HandleICECandidateEvent;
		this.localConnection.ontrack = this.handleTrackEvent;
		this.localConnection.onnegotiationneeded = this.handleNegotiationNeededEvent;
		this.localConnection.onremovetrack = this.handleRemoveTrackEvent;
		this.localConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
		this.localConnection.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent;
		this.localConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
		console.log("done");
	  
	  }

	  handleNegotiationNeededEvent() {


		  this.localConnection.createOffer().then(function(offer) {
		    return this.localConnection.setLocalDescription(offer);
		  })
		  .then(function() {
		    sendToServer({
		      name: this.myUsername,
		      target: this.targetUsername,
		      type: "video-offer",
		      sdp: this.localConnection.localDescription
		    });
		  })
		  .catch(reportError);
	}
	  

	handleGetUserMediaError(e) {
	  switch(e.name) {
	    case "NotFoundError":
	      alert("Unable to open your call because no camera and/or microphone" +
	            "were found.");
	      break;
	    case "SecurityError":
	    case "PermissionDeniedError":
	      // Do nothing; this is the same as the user canceling the call.
	      break;
	    default:
	      alert("Error opening your camera and/or microphone: " + e.message);
	      break;
	  }

	  console.log(e.closeVideoCall());
	}

	handleVideoOfferMsg(msg) {
	  var localStream = null;

	  targetUsername = msg.name;
	  createPeerConnection();

	  var desc = new RTCSessionDescription(msg.sdp);

	  this.localConnection.setRemoteDescription(desc).then(function () {
	    return navigator.mediaDevices.getUserMedia(mediaConstraints);
	  })
	  .then(function(stream) {
	    localStream = stream;
	    document.getElementById("local_video").srcObject = localStream;

	    localStream.getTracks().forEach(track => this.localConnection.addTrack(track, localStream));
	  })
	  .then(function() {
	    return this.localConnection.createAnswer();
	  })
	  .then(function(answer) {
	    return this.localConnection.setLocalDescription(answer);
	  })
	  .then(function() {
	    var msg = {
	      name: myUsername,
	      target: targetUsername,
	      type: "video-answer",
	      sdp: this.localConnection.localDescription
	    };

	    sendToServer(msg);
	  })
	  .catch(handleGetUserMediaError);
	}

	handleICECandidateEvent(event) {
	  if (event.candidate) {
	    sendToServer({
	      type: "new-ice-candidate",
	      target: this.targetUsername,
	      candidate: event.candidate
	    });
	  }
	}

	handleNewICECandidateMsg(msg) {
	  var candidate = new RTCIceCandidate(msg.candidate);

	  this.localConnection.addIceCandidate(candidate)
	    .catch(reportError);
	}

	handleTrackEvent(event) {
	   alert("receive video");
	  //document.getElementById("received_video").srcObject = event.streams[0];
	  //document.getElementById("hangup-button").disabled = false;
	}

	handleRemoveTrackEvent(event) {
	  var stream = document.getElementById("received_video").srcObject;
	  var trackList = stream.getTracks();
	 
	  if (trackList.length == 0) {
	    this.closeVideoCall();
	  }
	}

	handleICEConnectionStateChangeEvent(event) {
	  switch(this.localConnection.iceConnectionState) {
	    case "closed":
	    case "failed":
	    case "disconnected":
	      this.closeVideoCall();
	      break;
	  }
	}
	handleSignalingStateChangeEvent(event) {
	  switch(this.localConnection.signalingState) {
	    case "closed":
	      this.closeVideoCall();
	      break;
	  }
	};
	hangUpCall() {
	  this.closeVideoCall();
	  sendToServer({
	    name: this.myUsername,
	    target: this.targetUsername,
	    type: "hang-up"
	  });
	}

	closeVideoCall() {
	  var remoteVideo = document.getElementById("received_video");
	  var localVideo = document.getElementById("local_video");

	  if (this.localConnection) {
	    this.localConnection.ontrack = null;
	    this.localConnection.onremovetrack = null;
	    this.localConnection.onremovestream = null;
	    this.localConnection.onicecandidate = null;
	    this.localConnection.oniceconnectionstatechange = null;
	    this.localConnection.onsignalingstatechange = null;
	    this.localConnection.onicegatheringstatechange = null;
	    this.localConnection.onnegotiationneeded = null;

	    if (remoteVideo.srcObject) {
	      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
	    }

	    if (localVideo.srcObject) {
	      localVideo.srcObject.getTracks().forEach(track => track.stop());
	    }

	    this.localConnection.close();
	    this.localConnection = null;
	  }

	  remoteVideo.removeAttribute("src");
	  remoteVideo.removeAttribute("srcObject");
	  localVideo.removeAttribute("src");
	  remoteVideo.removeAttribute("srcObject");

	  document.getElementById("hangup-button").disabled = true;
	  targetUsername = null;
	}
  // Connect the two peers. Normally you look for and connect to a remote
  // machine here, but we're just connecting two local objects, so we can
  // bypass that step.
  */
