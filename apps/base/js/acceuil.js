
class Accueil {

	constructor(parent) {
		console.log("loaded");
		this.parent=parent;
		this.initialize();
	}

	async initialize() {

		this.iospace = "baseapp"; // IO namespace for this app
		console.log(window.location.href)
		this.io = io.connect(window.location.href + this.iospace); // connect socket.io
		this.io.on("connect", () => this.onIOConnect()); // listen connect event
		this.mvc = new MVC("myMVC", this, new MyModel(), new MyView(), new MyController()); // init app MVC
		await this.mvc.initialize(); // run init async tasks
		this.mvc.view.attach(document.body)//this.parent); // attach view
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

class MyModel extends Model {

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
	
	async Identifie() {		
		let reg=/^[a-zA-Z0-9]*|/
		if(reg.exec(this.mvc.view.input_ins.value)[0]!=this.mvc.view.input_ins.value)
			alert("erreur votre identifiant contient des erreurs ")
		else	
			{
				let result = await Comm.get("Identifie/"+this.mvc.view.input_ins.value); // wait data from server
			 	return result.response;
			 } // return it to controller
	}


}

class MyView extends View {

	constructor() {
		super();
		this.table = null;
	}

	initialize(mvc) {
		super.initialize(mvc);


		// get dataset display
		this.table = document.createElement("table");
		this.stage.appendChild(this.table);


		//champ texte pour l'inscritopn
		this.text_ins=document.createElement("text")
		this.text_ins.textContent="Inscription"
		this.stage.appendChild(this.text_ins);

		// texte pour qu'il comprennent
		this.input_ins=document.createElement("input")
		this.stage.appendChild(this.input_ins);

		//button pour l'inscription

		this.insc=document.createElement("button")
		this.insc.textContent="inscription"
		this.stage.appendChild(this.insc);

		// get dataset display
		this.table2 = document.createElement("table");
		this.stage.appendChild(this.table2);

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

		this.inscBtnHandler = e => this.inscBtnClick(e);
		this.insc.addEventListener("click", this.inscBtnHandler);
	}

	removeListeners() {

		this.insc.removeEventListener("click", this.inscBtnHandler);
	}

	btnClick(event) {
		this.mvc.controller.btnWasClicked("more parameters"); // dispatch
	}

	ioBtnClick(event) {
		this.mvc.controller.ioBtnWasClicked("io parameters"); // dispatch
	}
	
	inscBtnClick(event){
		this.mvc.controller.inscWasclicked("io parameters"); // dispatch

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
		this.iovalue.innerHTML = value.toString(); // update io display
	}

}

class MyController extends Controller {

	constructor() {
		super();
	}

	initialize(mvc) {
		super.initialize(mvc);

	}

	async inscWasclicked(params){
		trace("ins click", params);
		let reponse= await this.mvc.model.Identifie()
			
		if ( reponse[0]["id"] === true){ 
		
			this.mvc.view.destroy()
			//new Nouvelle(reponse[0]["value"])
			new Chat(reponse[0]["value"])
		}
		else
			alert("identifiant deja pris")
		
		this.mvc.app.io.emit("dummy", {message: "is click"}); // send socket.io packet

	}
	async btnWasClicked(params) {
		console.log(this.mvc.model)
		trace("btn click", params);
		this.mvc.view.update(await this.mvc.model.data(),this.mvc.view.table); // wait async request > response from server and update view table values
	}

	async ioBtnWasClicked(params) {
		trace("io btn click", params);
		this.mvc.app.io.emit("dummy", {message: "dummy io click"}); // send socket.io packet
	}

	ioDummy(data) {
		this.mvc.view.updateIO(data.value); // io dummy data received from main app
	}

}