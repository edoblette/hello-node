/**
    * RTC SIDE
    * Projet Web
    * @teacher Nicolas Prieur <nicopowa@gmail.com> <https://ilusio.dev/>     
    *
    * @autor Edgar Oblette <edwardoblette@gmail.com>
    * @collegues: Mehdi 
    *              
    * 20/12/2019
    */
class Rtc {
    constructor(adress) {
    	this.adress = null
	  	this.localConnection = null;   
	  	this.sendChannel = null;       

  		this.shoter = null;
  		this.target = null ;	 
		this.caller = null;
		this.method = null;

		this.message_box = null
  		this.webcamStream = null;

  		//media specs

  		this.mediaSpec = {
  			
  			audio :false,
  			video :false
		
  		}
	    //var transceiver; 	
	}
   
  	// Functions
  
	async sendToServer(msg) {
		if(this.adress)
			await this.adress.app.io.emit('to_server', msg);
		
	}

	async  Call(info){
		console.log("1 - J'appelle [INICIATOR]")
		this.adress = info.adress;
		if(!this.shoter)
	  		this.shoter = info.shoter;
	  	if(!this.target)
	  		this.target = info.target;
	  	this.caller = info.caller;
	  	this.method = info.method;

	   	this.init_media(this.method);

	  	this.message_box = this.adress.view.message_box;

		await this.LauchPeers()

	}

	async LauchPeers() {

	    this.localConnection = new RTCPeerConnection({
	    	iceServers: [{
	    		urls: "stun:stun.12connect.com:3478",
	         	urls: "stun:stun1.l.google.com:19302",
	            urls: "stun:stun2.l.google.com:19302"
	        }]
	    });

	    await this.GetMediaAccess();
	  	
	  	
	  	this.localConnection.ontrack = e => this.handleTrack(e);
		this.localConnection.onnegotiationneeded = e => this.Signal_Negociation(e);
		this.localConnection.onicecandidate = e => this.handleICECandidate(e);
		this.localConnection.onremovetrack = e => this.handleRemovedTrack(e);
		this.localConnection.oniceconnectionstatechange = e => this.handleICEConnectionStateChange(e);
		this.localConnection.onsignalingstatechange = e => this.handleSignalingStateChange(e);

		
	    // Create the data channel 
	    if(this.caller){
	    	this.sendChannel = this.localConnection.createDataChannel("message");
	    	this.sendChannel.onmessage = e => this.handleChannelNewMessage(e);

	    }else{
	    	this.localConnection.ondatachannel = e  => this.receiveChannelCallback(e);
	    }
	    
 	}

	async Signal_Negociation(){
		try {
	    
		    // If the connection hasn't yet achieved the "stable" state,
		    // return to the caller. Another negotiationneeded event
		    // will be fired when the state stabilizes.


		    if (this.localConnection.signalingState != "stable") {
		      console.log("NOT STABLE ABORD")
		      return;
		    }

		   	console.log("2 - Je negocie [INICIATOR]")
		   	await this.localConnection.createOffer().then(async (offer) => {
		   		await this.localConnection.setLocalDescription(offer);
			});
		   	
		  	console.log("3 - LocalDesc inite [INICIATOR]")
			this.sendToServer({
			      shoter: this.shoter,
			      target: this.target,
			      type: "offer",
			      method: this.method,
			      sdp: this.localConnection.localDescription
			    });
			console.log("4 - Offre envoye [INICIATOR]")

		} catch(err) {
	    	console.log("*** The following error occurred while handling the negotiationneeded event:" + err.message);
	   
	  };

	}

	async GetMediaAccess(){
  		console.log("ajoute media")
	    var transceiver;

	    if(!this.webcamStream){
		  	try {
		      this.webcamStream = await navigator.mediaDevices.getUserMedia({
			  		video:this.mediaSpec.video, 
			  		audio:this.mediaSpec.audio 
				});
		      document.getElementById("local_video").srcObject = this.webcamStream;
		    } catch(err) {
		      console.log(err.message);
		      return;
		    }
		}

	    // Add the tracks from the stream to the RTCPeerConnection
	    try {
	      this.webcamStream.getTracks().forEach(
	        transceiver = track => this.localConnection.addTransceiver(track, {streams: [this.webcamStream]})
	      );
	    } catch(err) {
	     console.log(err.message);
	    }
	}	


	init_media(method){
		// quel le methode d'appel
		document.getElementById("audiocall-button").style.display = "block";
		document.getElementById("videocall-button").style.display = "block";
  		switch(method){

  			case "audio": 
  				this.mediaSpec.audio = {
					    sampleSize: 16,
					    channelCount: 2
					}
  			break;

  			case "video": 
  				this.mediaSpec.video = {
					    width: { min: 640, ideal: 1920 },
					    height: { min: 400, ideal: 1080 },
					    aspectRatio: { ideal: 1.7777777778 }
					}
  			break;

  			case "mixed": 
  				/*
  				this.mediaSpec.audio = true;
  				this.mediaSpec.video = true
  				*/
  			  		this.mediaSpec.audio = {
					    sampleSize: 16,
					    channelCount: 2
					}

					this.mediaSpec.video = {
					    width: { min: 640, ideal: 1920 },
					    height: { min: 400, ideal: 1080 },
					    aspectRatio: { ideal: 1.7777777778 }
					}
				
  			break;

  			case "default": 
  				alert("default ")
  			break;
  		}

	}

    // User receive a Video Offer
	ReceiveOffer(params, info){
  		// quel est la nature du message
  		switch(params.type){

  			case "offer":  // Invitation and offer to chat
  				this.init_media(params.method);
	        	this.handleOffer(params,info);
	        	break;

	        case "answer":  // Callee has answered our offer
	        	this.handleAnswer(params,info);
	        	break;

	         case "new-ice-candidate":  // Callee has answered our offer
	        	this.handleNewIceCandidate(params,info);
	        	break;

	        case "end-of-candidate":  // Callee has answered our offer
	        	//nothing to do
	        	break;

	        case "hang-up":
	        	alert("Bye bye")
	        	this.closeVideoCall(params,info);
	        	break;
  		}
	}

   // User receive a Video Offer
	async handleOffer(params, info){


	  	console.log("1 - Je recois une offre [RECEVOR]")
	  	this.adress = info.adress;
	  	this.target = info.shoter ;
	  	this.shoter = info.target;
	  	this.caller = info.caller;
	  	this.message_box = this.adress.view.message_box;


	  	console.log("Received video chat offer from " + params.shoter);
	  	if (!this.localConnection) {
			this.LauchPeers(info);
		}

		var desc = new RTCSessionDescription(params.sdp);


	  	if (this.localConnection.signalingState != "stable") {
		    // Set the local and remove descriptions for rollback; don't proceed
		    // until both return
		   	await Promise.all([
		      this.localConnection.setLocalDescription({type: "rollback"}),
		      this.localConnection.setRemoteDescription(desc)
		    ]);
		    return;
		} else {
		    console.log ("  - Setting remote descriptor");
		    console.log("2 - Remote Desc reçu [RECEVOR]")
		    await this.localConnection.setRemoteDescription(desc);
		}

		  // Get the webcam stream if we don't already have it

		await this.GetMediaAccess();

		console.log("---> Creating and sending answer to caller");

		await this.localConnection.setLocalDescription(await this.localConnection.createAnswer());
		console.log("3 - LocalDesc Desc inite [RECEVOR]")
		 

		this.sendToServer({
			      shoter: this.shoter,
			      target: this.target,
			      type: "answer",
			      sdp: this.localConnection.localDescription
		});

		console.log("4 - Reponse envoye [RECEVOR]" +  this.shoter +  this.target)
	}
   
	// Recoie la reponse de la target
	async handleAnswer(params, info){
		console.log("5 - Reponse Recu [INICIATOR]")

	  	var desc = new RTCSessionDescription(params.sdp);
	  	await this.localConnection.setRemoteDescription(desc).catch(e => {
	      console.log("Failure Set Remote desc(): " + e.name)
	      console.log(params.sdp)
	  	});

	  	console.log("6 - Remote Desc reçu [INICIATOR]")
	  	
	}

	// Envoye les candidat Ice
	async handleICECandidate(event) {
		if (event.candidate) {
			console.log("Iceeeeee " + this.shoter + " to " + this.target)
		    this.sendToServer({
			    	type: "new-ice-candidate",
			    	shoter: this.shoter,
					target: this.target,
			    	candidate: event.candidate
			});
			
		}
	}

	// Recoie les candidat Ice
	async handleNewIceCandidate(params, info){		
		var candidate = new RTCIceCandidate(params.candidate);

		console.log("*** Adding received ICE candidate: " + JSON.stringify(candidate));

		await this.localConnection.addIceCandidate(candidate).catch(e => {
		    	console.log("Failure during addIceCandidate(): " + e.message);
		});
	
	} 

	// Recois les flux
	async handleTrack(event){
		console.log("JE RECOIS LE FLUX");

		document.getElementById("camera-container").style.display = "block";
		document.getElementById("received_video").srcObject = event.streams[0];
		var hang_up = document.getElementById("hangup-button")
	   	hang_up.disabled = false;
	   	hang_up.addEventListener("click",  e => this.handleHangup());
	}

	async handleRemovedTrack(event) {
		var stream = document.getElementById("received_video").srcObject;
		var trackList = stream.getTracks();
	 
		if (trackList.length == 0){
			alert("disconnected");
		    this.closeVideoCall();
		}
	}

	async handleHangup() {
		var msg = {
	    	shoter: this.shoter,
	    	target: this.target,
	    	type: "hang-up"
		}
		this.closeVideoCall();
		this.sendToServer(msg);
	}

	async handleICEConnectionStateChange(event) {
		switch(this.localConnection.iceConnectionState) {
	    	case "closed":
	    	case "failed":
	    	case "disconnected":
	    		//alert("ice connection closed");
	      		//this.closeVideoCall();
	      	break;
	  }
	}

	handleSignalingStateChange(event) {
		switch(this.localConnection.signalingState) {
	    	case "closed":
	    		alert("signaling state closed");
	      		this.closeVideoCall();
	      	break;
	  }
	}

	closeVideoCall() {
		console.log("End of connection")
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

		    if(this.sendChannel){
		    	this.sendChannel.close();
		    	this.sendChannel = null;
		    }
		    
		    this.localConnection.close();
		    this.localConnection = null;
		}

		remoteVideo.removeAttribute("src");
		remoteVideo.removeAttribute("srcObject");
		localVideo.removeAttribute("src");
		remoteVideo.removeAttribute("srcObject");

		document.getElementById("hangup-button").disabled = true;
		document.getElementById("camera-container").style.display = "none";

	 	this.shoter = null;
  		this.target = null ;	 
		this.caller = null;
		this.method = null;
		this.adress = null

		this.message_box = null
  		this.webcamStream = null;

  		//media specs
  		this.mediaSpec = {
  			audio :false,
  			video :false
  		}

	}

	// data chanel

	//send msg throw datachanel
	async sendMessage(msg) {
		if(this.sendChannel){
			var date = new Date();
			var timestamp = date.getHours() +':'+ date.getMinutes() +':'+ date.getSeconds();
			var msg = JSON.stringify({
		  		"shoter": this.shoter,
		  		"message": msg,
		  		"timestamp": timestamp
		  	})
		  	this.sendChannel.send(msg)
		  	this.message_format({message: msg, emiter:true})
		  	
		}else{
			console.log("Error datachannel not init ")
		}
	}

	receiveChannelCallback(e){
		console.log("call back");
		this.sendChannel = e.channel;
	    this.sendChannel.onmessage = e => this.handleChannelNewMessage(e);
	}

	handleChannelNewMessage(e){
		this.message_format({message: e.data, emiter:false})
	}

	message_format(msginfo){
		var message_container = document.createElement("p");
		if(msginfo.emiter){
			message_container.className = "msg_emited"
		}else{
			message_container.className = "msg_received"
		}
		var data = JSON.parse(msginfo.message)
		var msg = '[' + data.timestamp + "] " + data.shoter + " : " + data.message;
		var message_value = document.createTextNode(msg);
		message_container.appendChild(message_value);
		this.message_box.appendChild(message_container);
	}


}
