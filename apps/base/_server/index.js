const ModuleBase = load("com/base"); // import ModuleBase class


class Base extends ModuleBase {

	constructor(app, settings) {
		super(app, new Map([["name", "baseapp"], ["io", true]]));
		this.user = new Map();
		this.socket = null;
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

	Identifie(req, res, name)
	{	
		if(this.user.has(name))
			this.sendJSON(req, res, 200, [{id:false}]);
		else
		{
			this.user.set(name, "id" );
			this.sendJSON(req,res,200,[{id:true,value:name}]);
		}	

	}
	SendUser(req, res)
	{	
		let data=[]
		this.user.map(x=> data.push({name:x}))
		this.sendJSON(req, res, 200, data); // answer JSON
	}

	


	/**
	 * @method _onIOConnect : new IO client connected
	 * @param {*} socket 
	 */
	_onIOConnect(socket) {
		super._onIOConnect(socket); // do not remove super call
		this.socket = socket;
		socket.on("msg", packet => this._onDummyData(socket, packet)); // listen to "dummy" messages
		socket.on('new_user', user => this.new_user(socket, user));
		socket.on('to_server', message => this._messageHandler(message));
	}

	new_user(socket, user){
		if(user != null){
			this.user.set(user, socket);
			socket.broadcast.emit("msg", {message: user, value: "New user " + user}); // answer dummy random message
		}
	}

	_messageHandler(message){	
		
			console.log(message)
			if(message.shoter && message.target && message.type){
				let type = message.type;
				let shoter = message.shoter;
				let target = message.target;
				let sdp = message.sdp;
				if(this.user.has(target)){
						this.messageToClient(this.user.get(target), message)
				}
			}else 
				console.log("pas compris " + message)	

			
			//this.sendJSON(req, res, 200, {message: username});
	}
	async messageToClient(target, message){
		await target.emit("from_server",  message)
		console.log("sending to "+ target)
	}


	_onDummyData(socket, packet) { // dummy message received
		
	
		trace(socket.id, "user dit ", packet); // say it
		socket.broadcast.emit("user", {message: packet, value: "test"}); // answer dummy random message

	}

}

module.exports = Base; // export app class