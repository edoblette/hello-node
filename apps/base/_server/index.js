const ModuleBase = load("com/base"); // import ModuleBase class

class Base extends ModuleBase {

	constructor(app, settings) {
		super(app, new Map([["name", "baseapp"], ["io", true]]));
		this.user=new Array();
		this.user.push("name","coucou")
	}
    estunique(name) {

  		for (let i=0; i<this.user.length; i++) 
    		if (this.user[i] === name) 
      		return false
    
  		return true;
	}
	/**
	 * @method hello : world
	 * @param {*} req 
	 * @param {*} res 
	 * @param  {...*} params : some arguments
	 */
	hello(req, res, ... params) {
		let answer = ["hello", ...params, "!"].join(" "); // say hello
		trace(answer); // say it
		this.sendJSON(req, res, 200, {message: answer}); // answer JSON
	}

	/**
	 * @method data : random data response
	 * @param {*} req 
	 * @param {*} res 
	 */
	data(req, res) {
		let data = [ // some random data
			{id: 0, name: "data0", value: Math.random()},
			{id: 1, name: "data1", value: Math.random()},
			{id: 2, name: "data2", value: Math.random()},
			{id: 3, name: "data3", value: Math.random()}

		];
		this.sendJSON(req, res, 200, data); // answer JSON
	}


	other(req, res) {
		let data = [ // some random data
			{id: 0, name: "data0", value: Math.random()},
			{id: 1, name: "data1", value: Math.random()},
			{id: 2, name: "data2", value: Math.random()},
			{id: 3, name: "data3", value: Math.random()}
		];
		this.sendJSON(req, res, 200, data); // answer JSON
	}

	/**
	 * @method data : envoye un message
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} message 
	 */
	SendMessage(req, res, message){
		this.sendJSON(req, res, 200, [{message_content:message}]);
		trace("Message:", message)
	}

	Identifie(req, res,name)
	{	if(!this.estunique(name))
			this.sendJSON(req, res, 200, [{id:false}]);
		else
		{	this.user.push(name)	
			this.sendJSON(req,res,200,[{id:true,value:name}]);
		}	
		this.user.map(x=>trace(x))
		trace("quis sommes nous"+JSON.stringify(this.user))

	}

	/**
	 * @method _onIOConnect : new IO client connected
	 * @param {*} socket 
	 */
	_onIOConnect(socket) {
		super._onIOConnect(socket); // do notmove super call
		//let sendUser=this.user.map(x=>"{name:"+x+"}")
		this._io.emit("liste_of_clients",this.user)
		//trace(sendUser)
		}

	_onDummyData(socket, packet) { // dummy message received
		trace(socket.id, "dummy", packet); // say it
	//	socket.emit("dummy",{message:"salut a toi",value:2})
		socket.emit("dummy", {message: packet, value: Math.random()}); // answer dummy random message

	}
   _onIODisconnect(socket) {
        trace("io disconnect", this._name);
        this._clients.delete(socket.id);

        
    }

}

module.exports = Base; // export app class	