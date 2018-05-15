const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

const runningTasks = new Set;

class Task {
	constructor(callback,interval=60){
		this.id = Math.floor(Math.random() * 100000000000);
		this.callback = callback;
		this.interval = interval;
		this.runCount = 0;
	}

	start(){
		this.task = setInterval(() => {
			//console.log(`Task#${this.id} is running`)
			this.runCount = (this.runCount + 1) % 2000000000;
			this.callback(this);
		},this.interval * 1000);
	}

	stop(){
		console.log(this.id,`Task has been stopped`)
		clearInterval(this.task);
	}
}

client.on("ready", () => {
 	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
 	client.user.setActivity(`Serving ${client.guilds.size} servers`);

 	let task = new Task((t) => {
 		console.log(`Avoid termination : Counting... ${t.runCount}`);
 	},1);
 	task.start();
});

client.on("guildCreate", guild => {
 	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
 	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
 	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
 	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildMemberAdd", member => {
  	const guild = member.guild;
  	const user = member.user;

    guild.channels.find("name", "general").send(`Welcome ${user} to the server!\nPlease type '/rules' to see the Guild rules.`);
});

client.on("guildMemberRemove", member => {
  	
});


client.on("message", async message => {
	const channel = message.channel;

 	if(message.author.bot) return;
 
 	if(message.content.indexOf(config.prefix) !== 0) return;

 	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
 	const command = args.shift().toLowerCase();
 	const text = args.join(" ");

	message.delete().catch(O_o=>{});

 	console.log(`Got command : ${config.prefix}${command} ${args.join(" ")}`);

	if(command === "clear") {
		let task = new Task(async () => {
			let w = await channel.fetchMessages({ limit: 100 }).then(async messages => await messages.every(async m => await m.delete().catch(O_o => {})));
		},5 * 60);
		task.start();
		runningTasks.add(task);
	}

	if(command === "notify") {
		let task = new Task(async () => {
			let n = await channel.send(text);
		},3);
		task.start();
		runningTasks.add(task);
	}

	if(command === "stop") {
		runningTasks.forEach(task => {
			task.stop();
			runningTasks.delete(task);
		})
	}
});

<<<<<<< HEAD
client.login(config.token);
=======
client.login(config.token);

async function clearMessages(channel,size = 100){
	let b = await channel.fetchMessages({ limit: 100 })
  	.then(async messages => await messages.every(async m => {
  		let result = await m.delete().catch(O_o => {});
  		return Promise.resolve(result);
  	})).then(done => {
  		if(done) {
  			clearMessages(channel,100 + size);
  		}
  	});

  	if(b){
  		console.log(`${size+100} messages cleared so far!`);
  	}
}
>>>>>>> c821fc2afe87959879673d7084430b37b71e3517
