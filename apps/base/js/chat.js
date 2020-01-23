/**
    * Chat SIDE
    * Projet Web
    * @teacher Nicolas Prieur <nicopowa@gmail.com> <https://ilusio.dev/>     
    *
    * @autor Edgar Oblette <edwardoblette@gmail.com>
    * @collegues: Mehdi 
    *              
    * 20/12/2019
    */

class Chat {

	constructor(id_user) {
		console.log("chat loaded" + id_user);
		this.initialize(id_user);
	}

	async initialize(id_user) {

		this.iospace = "baseapp"; // IO namespace for this app
		this.io = io.connect(window.location.href + this.iospace); // connect socket.io
		this.io.on("connect", (socket) => this.onIOConnect(id_user)); // listen connect event
		console.log(this.io.id)
		this.mvc = new MVC("Chat", this, new ModelChat(), new ViewChat(), new ControllerChat()); // init app MVC
		await this.mvc.initialize(); // run init async tasks
		this.mvc.view.attach(document.body); // attach view
		this.mvc.view.activate(); // activate user interface
		this.mvc.controller.user = id_user;

	}
	
	/**
	 * @method test : test server GET fetch
	 */
	async test() {
		console.log("test server hello method");
		let result = await Comm.get("hello/everyone"); // call server hello method with argument "everyone"
		console.log("result", result);
		console.log("response", result.response);
	}
	
	/**
	 * @method onIOConnect : socket is connected
	*/ 
	onIOConnect(id_user) {
		

		this.io.emit('new_user', id_user);
		this.mvc.controller.user = id_user;
		

		this.io.on("msg", packet => this.socketData(packet)); // listen to "user" messages
		this.io.on("from_server", packet => this.RtcDemand(packet)); // listen to "user" messages
		//	this.io.emit("user", {value: "dummy data from client"}) // send test message
	}
 
	/**
	 * @method onDummyData : dummy data received from io server
	 * @param {Object} data 
	*/
	socketData(data) {
		this.mvc.controller.socketDataIn(data); // send it to controller
	}

	RtcDemand(data) {
		this.mvc.controller.RtcDemand(data); // send it to controller
	}
	

}

class ModelChat extends Model {

	constructor() {
		super();
	}

	async initialize(mvc) {
		super.initialize(mvc);
		await this.create_Rtc();
	}

	// methodess
	async create_Rtc(){
		//this.mvc.app.io.emit("msg", {value: "dummy data from client"})
		this.Rtc = new Rtc(this);
	}


	async create_offer(method){

		//await this.mvc.app.io.emit('to_server', {type: "offer",shoter: this.mvc.view.username.value, target: this.mvc.view.target.value});
		// await Comm.get("messageHandler/" + msg);
		var info = {
			adress: this.mvc,
			shoter: this.mvc.controller.user ,
			target: this.mvc.view.target.value,
			caller: true,
			method: method
		};
		await this.Rtc.Call(info)
	}

	async receive_offer(params){
		var info = {
			adress: this.mvc,
			shoter: params.shoter,
			target: params.target,
			caller: false
		};
		this.Rtc.ReceiveOffer(params, info)
		//await this.Rtc.Call(info)


	}

	async hang_up(){
		this.Rtc.handleHangup();
		//await this.Rtc.Call(info)


	}
	
	async data() {
		trace("get data");
		// keep data in class variable ? refresh rate ?
		let result = await Comm.get("data"); // wait data from server
		return result.response; // return it to controller
	}
	async other() {
		trace("get data");
		// keep data in class variable ? refresh rate ?
		let result = await Comm.get("other"); // wait data from server
		return result.response; // return it to controller
	}
	
 	async SendMessageToRtc(msg){
		this.Rtc.sendMessage(msg);
	}


}

class ViewChat extends View {

	constructor() {
		super(); 
		this.table = null;
	}

	initialize(mvc) {
		super.initialize(mvc);
	/*
		this.username=document.createElement("input")
		this.username.placeholder = "username" 
		this.username.value = ""
		this.stage.appendChild(this.username)
	*/
	
	var right_side = document.createElement("div")
					right_side.className = "split right_side"

		this.target=document.createElement("input")
		this.target.placeholder = "target"
		this.target.value = ""
		right_side.appendChild(this.target)

		// create button connect
		this.btn_connect=document.createElement("button")
		this.btn_connect.innerHTML = "connect"
		right_side.appendChild(this.btn_connect)

		this.message_box = document.createElement("div");
			this.message_box.id = "message_box"
			this.message_box.style.width = "auto"
			this.message_box.style.height = "200px"
			this.message_box.style.overflow = "scroll";
		right_side.appendChild(this.message_box)
		
				// create message input
		this.text=document.createElement("input")
		this.text.placeholder = "message"
		this.text.style.width = "100%"
		right_side.appendChild(this.text)

		// create button send message
		this.btn=document.createElement("button")
		this.btn.innerHTML = "envoyer"
		right_side.appendChild(this.btn)

	this.stage.appendChild(right_side)

	var left_side = document.createElement("div")
					left_side.className = "split left_side"

		var div_chat = document.createElement("div");
			div_chat.id = "chat"

			var camera_container = document.createElement("div")
				camera_container.id = "camera-container"

				var camera_box = document.createElement("div")
					camera_box.className = "camera-box"

					var receive_video = document.createElement("video")
						receive_video.id = "received_video"
						receive_video.style.width = "100%"
						receive_video.autoplay = true
					camera_box.appendChild(receive_video)

					var local_video = document.createElement("video")
						local_video.id = "local_video"
						local_video.style.width = "40%"
						local_video.autoplay = true
					camera_box.appendChild(local_video)
				camera_container.appendChild(camera_box)

				var hang_up = document.createElement("button")
						hang_up.id = "hangup-button"
						hang_up.innerHTML = "Raccrocher"
						hang_up.disabled = true

				camera_container.appendChild(hang_up)

			div_chat.appendChild(camera_container)

		left_side.appendChild(div_chat)

		// create button audio
		 this.btn_audio = document.createElement("button")
			this.btn_audio.id = "audiocall-button"
			this.btn_audio.innerHTML = "Appel audio"
			this.btn_audio.style.display = "none"

		left_side.appendChild(this.btn_audio)

		// create button video
		 this.btn_video = document.createElement("button")
			this.btn_video.id = "videocall-button"
			this.btn_video.innerHTML = "Appel video"
			this.btn_video.style.display = "none"

		left_side.appendChild(this.btn_video)

	this.stage.appendChild(left_side)



	
	}

	// activate UI
	activate() {
		super.activate();
		this.addListeners(); // listen to events
	}

	// deactivate
	deactivate() {
		super.deactivate();
		this.removeListeners();
	}

	addListeners(){
		// on met un event sur le bouton d'envoi
		this.getBtnHandler = e => this.sendBtnClick(e);
		this.btn.addEventListener("click", this.getBtnHandler);
		this.text.addEventListener('keyup', async e => {
  			if((e.keyCode === 13) && (this.text.value)){
  				this.sendBtnClick(e)
  				this.text.value = "";
  			}
  		});

		this.btn_connect.addEventListener("click",  e => this.connectBtnClick(e, "mixed"));
		this.btn_audio.addEventListener("click",  e => this.connectBtnClick(e, "audio"));
		this.btn_video.addEventListener("click",  e => this.connectBtnClick(e, "video"));
	}

	removeListeners(){
		// on supprime l'event sur le bouton d'envoi
		this.btn.removeEventListener("click", this.getBtnHandler);
		this.btn_connect.removeListener("click",  e => this.connectBtnClick(e));
		this.btn_audio.removeListener("click", e => this.connectBtnClick(e));
		this.btn_video.addEventListener("click",  e => this.connectBtnClick(e));
		
	}

	sendBtnClick(event){
		this.mvc.controller.sendBtnClicked(); // dispatch
	}
	connectBtnClick(event, method){
		this.mvc.controller.connectBtnClicked(method); // dispatch
	}

	update(data) {
		// create message input
		this.newmessage=document.createElement("p")
		this.newmessage.innerHTML = data
		this.stage.appendChild(this.newmessage)
	}
	
	updateIO(value) {
	
	}



}

class ControllerChat extends Controller {

	constructor() {
		super();
		this.id_user = null;

	}

	initialize(mvc) {
		super.initialize(mvc);

	}

	async sendBtnClicked(params){		
		let response = await this.mvc.model.SendMessageToRtc(this.mvc.view.text.value);
		//this.mvc.view.update(response);
	}

	async connectBtnClicked(method){
		
		//if((method === "audio") || (method === "video") || (method === "mixed"))
			//this.mvc.model.hang_up();
		
		await this.mvc.model.create_offer(method);

	}

	async RtcDemand(params){

		await this.mvc.model.receive_offer(params);
	}

	socketDataIn(data) {
		alert(data.value);
	}

	set user(pseudo){
		this.id_user = pseudo;
	}


	get user(){
		return this.id_user;
	}
}
