
class Contact {

	constructor(name) {
		console.log("loaded");
		this.ProfileName=name
		this.initialize();
	}

	async initialize() {
		this.iospace = "baseapp"; // IO namespace for this app
		this.io = io.connect("http://localhost/" + this.iospace); // connect socket.io
		this.mvc = new MVC("MyMvc", this, new ModelContact(), new ViewContact(this.ProfileName), new ControllerContact()); // init app MVC
		await this.mvc.initialize(); // run init async tasks
		this.io.on("connect", () =>
				this.onIOConnect()); // listen connect event
		this.mvc.view.attach(document.body); //sd  attach view
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
		this.io.on("liste_of_clients",packet=>{

				console.log("ma taill est de "+packet[0])
				this.mvc.controller.update_table(packet)
				})
		this.io.on("new_client",packet=>{

				console.log("ma taill est de "+packet.lenght)
				this.mvc.controller.add_client(packet)
				})
	
	 // listen to "dummy" messages

		 // listen to "dummy" messages
	}

	/**
	 * @method onDummyData : dummy data received from io server
	 * @param {Object} data 
	 */
	onDummyData(data) {
		this.mvc.controller.ioDummy(data); // send it to controller
	}

	update_table(packet)
	{
		this.mvc.controller.update_table(packet)
	}
	add(packet){
		
		this.mvc.controller.add_client(packet)	
	}
}

class ModelContact extends Model {

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
	
	
	
}

class ViewContact extends View {

	constructor(name) {
		super(); 
		this.table = null;
		this.ProfileName=name
	}

	initialize(mvc) {
		super.initialize(mvc);
		this.text=document.createElement("text")
		this.text.innerHTML="Contact :"+this.ProfileName+"\n"
		this.stage.appendChild(this.text)
		this.utilisateur=document.createElement("table")
		this.stage.appendChild(this.utilisateur)
		this.stage.style.left = "100px";
		this.stage.style.top = "0px";
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
	
	}

	removeListeners(){
	
	}


	update(data) {
		console.log("update "+data[0])
		while(this.utilisateur.firstChild)this.utilisateur.removeChild(this.utilisateur.firstChild); // empty table
		//je ne comprend pas pourquoi cela ne marche pas j'ai du faire machine arriere
		if(data[0]!==undefined)
		data.forEach(el => { // loop data
			let line = document.createElement("tr"); // create line
			Object.keys(el).forEach(key => { // loop object keys
				let cell = document.createElement("td"); // create cell
				cell.innerHTML = el; // display
				line.appendChild(cell); // add cell
				console.log(el)
			});
			this.utilisateur.appendChild(line); // add line
			})//);
		else
			alert("coucou")
	}
	
	update_new(data) {
		console.log("update "+data[0])
		while(this.utilisateur.firstChild)this.utilisateur.removeChild(this.utilisateur.firstChild); // empty table
		//je ne comprend pas pourquoi cela ne marche pas j'ai du faire machine arriere
		let line = document.createElement("tr");
		if(data[0]!==undefined){
		for (var i = data.length - 1; i >= 0; i--) {
				  // create line
				let cell = document.createElement("td"); // create cell
				cell.innerHTML = data[i]; // display
				line.appendChild(cell); // add cell
				console.log(data[i])
			};
			this.utilisateur.appendChild(line); // add line
		}
		else
			alert("coucou")
	}
	updateIO(value) {
	
	}

}

class ControllerContact extends Controller {

	constructor() {
		super();
		
	}

	initialize(mvc) {
		super.initialize(mvc);
		this.client=new Set()
	
		
	}

	async add_client(client){
		this.client.add(client)
		this.client.forEach(x=>alert((x+"c'est moi")))
		this.mvc.view.update(this.client); // wait async request > response from server and update view table values
	}
	
	update_table(packet)
	{   if(packet[0]!==undefined){
		this.client.clear()
		this.client=packet
		this.mvc.view.update_new(this.client)
		}
	}
	async btnWasClicked(params) {
		trace("btn click", params);
	}

	async ioBtnWasClicked(params) {
		trace("io btn click", params);
	}

	ioDummy(data) {
		this.mvc.view.updateIO(data.value); // io dummy data received from main app

	}

}	