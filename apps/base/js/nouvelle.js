
class Nouvelle {

	constructor(nom) {
		console.log("Nouvelle");
		this.nom=nom;
		this.initialize();
	}

	async initialize() {

		this.iospace = "baseapp"; // IO namespace for this app
		this.io = io.connect("http://localhost/Nouvelle" + this.iospace); // connect socket.io
		this.io.on("connect", () => this.onIOConnect()); // listen connect event

		this.mvc = new MVC("myMVC", this, new ModelNouvelle(), new ViewNouvelle(this.nom), new ControllerNouvelle()); // init app MVC
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

class ModelNouvelle extends Model {

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

class ViewNouvelle extends View {

	constructor(nom) {
		super();
		this.table = null;
		this.nom=nom
	}

	initialize(mvc) {
		super.initialize(mvc);






		//champ texte pour l'inscritopn
		this.text_ins=document.createElement("text")
		this.text_ins.textContent="bonjour "+this.nom+" \n bienvenue";
		this.stage.appendChild(this.text_ins);




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

	addListeners() {
	
	}

	removeListeners() {
	
	}

	btnClick(event) {
	}

	ioBtnClick(event) {
	}
	
	update(data,table) {
		while(table.firstChild) table.removeChild(table.firstChild); // empty table
		data.forEach(el => { // loop data
			let line = document.createElement("tr"); // create line
			Object.keys(el).forEach(key => { // loop object keys
				let cell = document.createElement("td"); // create cell
				cell.innerHTML = el[key]; // display
				line.appendChild(cell); // add cell
			});
			table.appendChild(line); // add line
		});
	}
	
	updateIO(value) {
		//this.iovalue.innerHTML = value.toString(); // update io display
	}

}

class ControllerNouvelle extends Controller {

	constructor() {
		super();
	}

	initialize(mvc) {
		super.initialize(mvc);

	}

	
	async btnWasClicked(params) {
		trace("btn click", params);
	}

	async ioBtnWasClicked(params) {
		trace("io btn click", params);
	}

	ioDummy(data) {
	}

}