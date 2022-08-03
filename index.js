import {} from 'dotenv/config';
import fs from 'fs';
import { Client, GatewayIntentBits } from 'discord.js';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';


initializeApp({
	credential: cert('./firebase.json')
});

const firedb = getFirestore();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const events = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'));

for (let event of events) {
	const eventFile = await import(`#events/${event}`);
	if (eventFile.once)
		client.once(eventFile.name, (...args) => {
			eventFile.invoke(...args);
		});
	else
		client.on(eventFile.name, (...args) => {
			eventFile.invoke(...args);
		});
}


client.on("messageCreate", async message => {
    if(message.content == ("!mangos")) {
        const uid = message.author.id;
		if(message.channel.id == '1004067291899637770') {
				const random  = Math.floor(Math.random() * (500 - 250 + 1)) + 250;
				if(message.member.roles.cache.has('956510885269094421')) {
					const viprandom = Math.floor(Math.random() * 6);
					const rate = 2.0 + 0.1 * viprandom
					const goodmangos = random * rate;
					const collectionx = firedb.collection('timeouts');
					let doc = await collectionx.doc(`${uid}`).get();
					if (!doc.exists) {
						await collectionx.doc(`${uid}`).set({
							timestamp: Date.now()+21600000
						});
						message.channel.send(`.tip ${goodmangos} mango ${message.author}`)
					} else {
						if(doc.data().timestamp<Date.now()) {
							await collectionx.doc(`${uid}`).set({
								timestamp: Date.now()+21600000
							});
							message.channel.send(`.tip ${goodmangos} mango ${message.author}`)
						} else {
							message.react('❌');
						}
					}
					//debug note
					//message.channel.send(`debug: rate: ${rate}, mangos without rate: ${random}, mangos with rate: ${goodmangos}`)
				} else {
					const collectionx = firedb.collection('timeouts');
					let doc = await collectionx.doc(`${uid}`).get();
					if (!doc.exists) {
						await collectionx.doc(`${uid}`).set({
							timestamp: Date.now()+21600000
						});
						message.channel.send(`.tip ${random} mango ${message.author}`)
					} else {
						if(doc.data().timestamp<Date.now()) {
							await collectionx.doc(`${uid}`).set({
								timestamp: Date.now()+21600000
							});
							message.channel.send(`.tip ${random} mango ${message.author}`)
						} else {
							message.react('❌');
						}
					}
				}
			} else {
				message.channel.send(`Faucet only work on <#1004067291899637770> channel`)
			}
		}        


	if(message.channel.id == '1004067291899637770') {
		if(message.content == "!mangos") {}
		else if(message.author.id == '1003825112425955368') {}
		else if(message.author.id == '330677994442063873') {} //Avile
		else if(message.member.roles.cache.has('954500772161265696')) {} //mango police
		else if(message.member.roles.cache.has('954492309079216158')) {} //treasurer
		else {message.delete()};
	} 

	

	if(message.content.toLowerCase() == ("!mangoflip")) {
		const result = Math.floor(Math.random() * 2);
		if(result == 0) {
			message.channel.send(`You rolled a Mango <:MangoCoin2:957984646631669780><:MangoCoin2:957984646631669780><:MangoCoin2:957984646631669780>`);
		} else if (result == 1) {
			message.channel.send(`You rolled an Orange <:MangoBall:988051322282586222><:MangoBall:988051322282586222><:MangoBall:988051322282586222>`);
		} else {
			message.channel.send(`An error occured`);
		}
        
    }
})

client.login(process.env.BOT_TOKEN);
