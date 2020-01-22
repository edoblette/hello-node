/**
    * Serveur SIDE
    * Projet Web
    * @teacher Nicolas Prieur <nicopowa@gmail.com> <https://ilusio.dev/>     
    *
    * @autor Edgar Oblette <edwardoblette@gmail.com>
    * @collegues: Mehdi 
    *              
    * 20/12/2019
    */
const ModuleBase = load("com/base"); // import ModuleBase class


class Base extends ModuleBase {

	constructor(app, settings) {
		super(app, new Map([["name", "baseapp"], ["io", true]]));
<<<<<<< HEAD
		this.user = new Map();
		this.socket = null;
=======
<<<<<<< HEAD
		this.user = new Map();
		this.socket = null;
=======
		this.user=new Array();
		this.user.push("name","coucou")
>>>>>>> 185a3269ab897b6534c4d9de4c91d8c359c9bcb0
>>>>>>> dfb28746c6fc5d46ca67c25e45dc9b5d6026cb25
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> dfb28746c6fc5d46ca67c25e45dc9b5d6026cb25
	Identifie(req, res, name)
	{	
		if(this.user.has(name))
			this.sendJSON(req, res, 200, [{id:false}]);
		else
		{
			this.user.set(name, "id" );
<<<<<<< HEAD
=======
=======
	Identifie(req, res,name)
	{	if(!this.estunique(name))
			this.sendJSON(req, res, 200, [{id:false}]);
		else
		{	this.user.push(name)	
>>>>>>> 185a3269ab897b6534c4d9de4c91d8c359c9bcb0
>>>>>>> dfb28746c6fc5d46ca67c25e45dc9b5d6026cb25
			this.sendJSON(req,res,200,[{id:true,value:name}]);
		}	
		this.user.map(x=>trace(x))
		trace("quis sommes nous"+JSON.stringify(this.user))

	}
<<<<<<< HEAD
	SendUser(req, res)
	{	
		let data=[]
		this.user.map(x=> data.push({name:x}))
		this.sendJSON(req, res, 200, data); // answer JSON
	}

<<<<<<< HEAD
	

=======
	Offer(req, res, username, target)
	{	
		if( this.user.has(target)){
			trace("Target-session: " + this.user.get(target));
			this.messageTo(this.user.get(target));
			//this.sendJSON(req, res, 200, {user: this.user.get(target)});
			//this.user[emit("user", {message: packet, value: "test"}); // answer dummy random message
		}else{
			trace("Target: " + target + "don't exist");
		}
		
		//this.sendJSON(req, res, 200, {message: username});
	}

=======
>>>>>>> 185a3269ab897b6534c4d9de4c91d8c359c9bcb0
>>>>>>> dfb28746c6fc5d46ca67c25e45dc9b5d6026cb25

	/**
	 * @method _onIOConnect : new IO client connected
	 * @param {*} socket 
	 */
	_onIOConnect(socket) {
<<<<<<< HEAD
		super._onIOConnect(socket); // do not remove super call
		this.socket = socket;
		socket.on("msg", packet => this._onDummyData(socket, packet)); // listen to "dummy" messages
		socket.on('new_user', user => this.new_user(socket, user));
<<<<<<< HEAD
		socket.on('to_server', message => this._messageHandler(message));
=======
>>>>>>> dfb28746c6fc5d46ca67c25e45dc9b5d6026cb25
	}

	new_user(socket, user){
		if(user != null){
<<<<<<< HEAD
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

=======
			//var new_target = socket.id.replace('/baseapp#', '');
			//trace(new_target + " new user: " + user);
			this.user.set(user, socket);
			socket.broadcast.emit("msg", {message: user, value: "New user " + user}); // answer dummy random message
=======
		super._onIOConnect(socket); // do notmove super call
		//let sendUser=this.user.map(x=>"{name:"+x+"}")
		this._io.emit("liste_of_clients",this.user)
		//trace(sendUser)
>>>>>>> 185a3269ab897b6534c4d9de4c91d8c359c9bcb0
		}
	}

	async messageTo(target){
		await target.emit("msg", { value: "la forme ?"})
		console.log("sending to "+ target)
	}
>>>>>>> dfb28746c6fc5d46ca67c25e45dc9b5d6026cb25

	_onDummyData(socket, packet) { // dummy message received
		
	
		trace(socket.id, "user dit ", packet); // say it
		socket.broadcast.emit("user", {message: packet, value: "test"}); // answer dummy random message

	}
   _onIODisconnect(socket) {
        trace("io disconnect", this._name);
        this._clients.delete(socket.id);

        
    }

}

module.exports = Base; // export app class	