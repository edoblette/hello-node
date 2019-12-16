
class Chat {

	constructor() {
		console.log("chat loaded");

		this.initialize();
	}

	async initialize() {

		this.iospace = "baseapp"; // IO namespace for this app
		this.io = io.connect("http://localhost/" + this.iospace); // connect socket.io
		this.io.on("connect", () => this.onIOConnect()); // listen connect event

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
		trace("yay IO connected");
		this.io.on("dummy", packet => this.onDummyData(packet)); // listen to "dummy" messages
		this.io.emit("dummy", {value: "dummy data from client"}) // send test message
	}

	/**
	 * @method onDummyData : dummy data received from io server
	 * @param {Object} data 
	 */
	onDummyData(data) {
		trace("IO data", data);
		this.mvc.controller.ioDummy(data); // send it to controller
	}
}

class ModelChat extends Model {

	constructor() {
		super();
	}

	async initialize(mvc) {
		super.initialize(mvc);

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
	
	async SendMessage(message){
			// keep data in class variable ? refresh rate ?
		 await Comm.get("SendMessage/"+ message); // wait data from server
		return message; // return it to controller
	}

}

class ViewChat extends View {

	constructor() {
		super(); 
		this.table = null;
	}

	initialize(mvc) {
		super.initialize(mvc);

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
	}

	removeListeners(){
		// on supprime l'event sur le bouton d'envoi
		this.btn.removeEventListener("click", this.getBtnHandler);
	}


	sendBtnClick(event){
		this.mvc.controller.sendBtnClicked(); // dispatch
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
		let response = await this.mvc.model.SendMessage( this.mvc.view.text.value);
		this.mvc.view.update(response);
	}



	ioDummy(data) {
	
	}

}