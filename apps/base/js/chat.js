
class Chat {

	constructor() {
		console.log("chat loaded");

		this.initialize();
	}

	async initialize() {

		this.iospace = "baseapp"; // IO namespace for this app
		this.io = io.connect("http://localhost/" + this.iospace); // connect socket.io
		this.io.on("connect", (socket) => this.onIOConnect()); // listen connect event
		console.log(this.io.id)
		this.mvc = new MVC("Chat", this, new ModelChat(), new ViewChat(), new ControllerChat()); // init app MVC
		await this.mvc.initialize(); // run init async tasks
		this.mvc.view.attach(document.body); // attach view
		this.mvc.view.activate(); // activate user interface

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
	onIOConnect() {
		var pseudo = prompt('Quel est votre pseudo ?');
		this.io.emit('new_user', pseudo);
		this.io.on("msg", packet => this.socketData(packet)); // listen to "user" messages
		console.log(this.socket);
		//	this.io.emit("user", {value: "dummy data from client"}) // send test message
	}
 
	/**
	 * @method onDummyData : dummy data received from io server
	 * @param {Object} data 
	*/
	socketData(data) {
		this.mvc.controller.socketDataIn(data); // send it to controller
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


	async create_offer(){
		await this.Rtc.CreateOffer()
	}

	async receive_offer(){
		this.Rtc.connect_Rtc()

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

	ReceiveMessageToRtc(msg){
		console.log("j'ai recu" + msg);
	}

}

class ViewChat extends View {

	constructor() {
		super(); 
		this.table = null;
	}

	initialize(mvc) {
		super.initialize(mvc);

		this.username=document.createElement("input")
		this.username.placeholder = "username" 
		this.username.value = this.mvc.view.user_id
		this.stage.appendChild(this.username)


		this.target=document.createElement("input")
		this.target.placeholder = "target"
		this.target.value = "kio"
		this.stage.appendChild(this.target)

		// create button connect
		this.btn_connect=document.createElement("button")
		this.btn_connect.innerHTML = "connect"
		this.stage.appendChild(this.btn_connect)

		// create message input
		this.text=document.createElement("input")
		this.text.placeholder = "message"
		this.stage.appendChild(this.text)


		// create button send message
		this.btn=document.createElement("button")
		this.btn.innerHTML = "envoyer"
		this.stage.appendChild(this.btn)

		//setInterval(this.mvc.controller.inscWasclicked,1500)
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
		this.btn_connect.addEventListener("click",  e => this.connectBtnClick(e));
	}

	removeListeners(){
		// on supprime l'event sur le bouton d'envoi
		this.btn.removeEventListener("click", this.getBtnHandler);
		this.btn_connect.removeListener("click", this.getBtn_connectHandler);
	}


	sendBtnClick(event){
		this.mvc.controller.sendBtnClicked(); // dispatch
	}
	connectBtnClick(event){
		this.mvc.controller.connectBtnClicked(); // dispatch
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
		

	}

	initialize(mvc) {
		super.initialize(mvc);

	}

	async sendBtnClicked(params){
		let response = await this.mvc.model.SendMessageToRtc(this.mvc.view.text.value);
		this.mvc.view.update(response);
	}
	async connectBtnClicked(params){
		await this.mvc.model.create_offer();

	}

	socketDataIn(data) {
		alert(data.value);
	}

}
