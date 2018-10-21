const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '1play'

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
client.user.setGame(``,"")
  console.log('')
  console.log('')
  console.log('╔[═════════════════════════════════════════════════════════════════]╗')
  console.log(`[Start] ${new Date()}`);
  console.log('╚[═════════════════════════════════════════════════════════════════]╝')
  console.log('')
  console.log('╔[════════════════════════════════════]╗');
  console.log(`Logged in as * [ " ${client.user.username} " ]`);
  console.log('')
  console.log('Informations :')
  console.log('')
  console.log(`servers! [ " ${client.guilds.size} " ]`);
  console.log(`Users! [ " ${client.users.size} " ]`);
  console.log(`channels! [ " ${client.channels.size} " ]`);
  console.log('╚[════════════════════════════════════]╝')
  console.log('')
  console.log('╔[════════════]╗')
  console.log(' Bot Is Online')
  console.log('╚[════════════]╝')
  console.log('')
  console.log('')
});


const Util = require('discord.js');

const getYoutubeID = require('get-youtube-id');

const fetchVideoInfo = require('youtube-info');

const YouTube = require('simple-youtube-api');

const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");

const queue = new Map();

const ytdl = require('ytdl-core');

const fs = require('fs');

const gif = require("gif-search");


const prefix = ">"
client.on('message', async msg => { 
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(prefix)) return undefined;
	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);
	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)
	if (command === `play`) {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('ÙŠØ¬Ø¨ Ø§Ù† ØªÙƒÙˆÙ† Ø¨Ø±ÙˆÙ… ØµÙˆØªÙŠ ');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			
			return msg.channel.send('Ù…Ø§ Ø¹Ù†Ø¯ÙŠ ØµÙ„Ø§Ø­ÙŠØ§Øª Ù„Ù„Ø¯Ø®ÙˆÙ„ ÙÙŠ Ù‡Ø§Ø¯ Ø§Ù„Ø±Ø±ÙˆÙ…');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('Ù…Ø§ Ø¹Ù†Ø¯ÙŠ ØµÙ„Ø§Ø­ÙŠØ§Øª Ù„Ù„ØªÙƒÙ„Ù… ÙÙŠ Ù‡Ø§Ø¯ Ø§Ù„Ø±Ø±ÙˆÙ…');
		}

		if (!permissions.has('EMBED_LINKS')) {
			return msg.channel.sendMessage("**`EMBED LINKS ÙŠØ¬Ø¨ Ø§Ù† Ø§ØªÙˆÙØ± Ø¨Ø±Ù…Ø´Ù† **")
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, msg, voiceChannel, true);
			}
			return msg.channel.send(` **${playlist.title}** ØªÙ… Ø§Ù„Ø¶Ø§ÙØ© Ø§Ù„ÙŠ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„ØªØ´ØºØ¨Ù„`);
		} else {
			try {

				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 5);
					let index = 0;
					const embed1 = new Discord.RichEmbed()
			        .setDescription(`**Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø§Ø®ØªÙŠØ§Ø± Ø±Ù‚Ù… Ø§Ù„Ù…Ù‚Ø·Ø¹** :
${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`)

					.setFooter("Speed Bot")
					msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
					
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 15000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('Ù„Ù… ÙŠØªÙ… Ø¥Ø®ØªÙŠØ¢Ø± Ø§ÙŠ Ù…Ù‚Ø·Ø¹ ØµÙˆØªÙŠ');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send(':X: Ù„Ø§ ÙŠØªÙˆÙØ± Ù†ØªØ¢Ø¦Ø¬ Ø¨Ø­Ø« ');
				}
			}

			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === `skip`) {
		if (!msg.member.voiceChannel) return msg.channel.send('Ø£Ù†Øª Ù„Ø³Øª Ø¨Ø±ÙˆÙ… ØµÙˆØªÙŠ .');
		if (!serverQueue) return msg.channel.send('Ù…Ø§ÙÙŠ Ø§ÙŠ Ù…Ù‚Ø·Ø¹ Ù„ØªØ¬Ø§ÙˆØ²Ù‡');
		serverQueue.connection.dispatcher.end('ØªÙ… ØªØ¬Ø§ÙˆØ² Ø§Ù„Ù…Ù‚Ø·Ø¹');
		return undefined;
	} else if (command === `stop`) {
		if (!msg.member.voiceChannel) return msg.channel.send('Ø£Ù†Øª Ù„Ø³Øª Ø¨Ø±ÙˆÙ… ØµÙˆØªÙŠ .');
		if (!serverQueue) return msg.channel.send('Ù„Ù…Ø§ÙÙŠ Ø§ÙŠ Ù…Ù‚Ø·Ø¹ Ù„Ø§ÙŠÙ‚Ø§ÙÙ‡');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('ØªÙ… Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„Ù…Ù‚Ø·Ø¹');
		return undefined;
	} else if (command === `vol`) {
		if (!msg.member.voiceChannel) return msg.channel.send('Ø£Ù†Øª Ù„Ø³Øª Ø¨Ø±ÙˆÙ… ØµÙˆØªÙŠ .');
		if (!serverQueue) return msg.channel.send('Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø´ÙŠØ¡ Ø´ØºØ¢Ù„.');
		if (!args[1]) return msg.channel.send(`:loud_sound: Ù…Ø³ØªÙˆÙ‰ Ø§Ù„ØµÙˆØª **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
		return msg.channel.send(`:speaker: ØªÙ… ØªØºÙŠØ± Ø§Ù„ØµÙˆØª Ø§Ù„ÙŠ **${args[1]}**`);
	} else if (command === `np`) {
		if (!serverQueue) return msg.channel.send('Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø´ÙŠØ¡ Ø­Ø§Ù„ÙŠ ÙØ§Ù„Ø¹Ù…Ù„.');
		const embedNP = new Discord.RichEmbed()
	.setDescription(`:notes: Ø§Ù„Ø§Ù† ÙŠØªÙ… ØªØ´ØºÙŠÙ„ : **${serverQueue.songs[0].title}**`)
		return msg.channel.sendEmbed(embedNP);
	} else if (command === `queue`) {
		
		if (!serverQueue) return msg.channel.send('Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø´ÙŠØ¡ Ø­Ø§Ù„ÙŠ ÙØ§Ù„Ø¹Ù…Ù„.');
		let index = 0;
		
		const embedqu = new Discord.RichEmbed()

.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**Ø§Ù„Ø§Ù† ÙŠØªÙ… ØªØ´ØºÙŠÙ„** ${serverQueue.songs[0].title}`)
		return msg.channel.sendEmbed(embedqu);
	} else if (command === `pause`) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('ØªÙ… Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ù…Ø¤Ù‚ØªØ§!');
		}
		return msg.channel.send('Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø´ÙŠØ¡ Ø­Ø§Ù„ÙŠ Ù Ø§Ù„Ø¹Ù…Ù„.');
	} else if (command === "resume") {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('Ø§Ø³ØªØ£Ù†ÙØª Ø§Ù„Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ø¨Ø§Ù„Ù†Ø³Ø¨Ø© Ù„Ùƒ !');
		}
		return msg.channel.send('Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø´ÙŠØ¡ Ø­Ø§Ù„ÙŠ ÙÙŠ Ø§Ù„Ø¹Ù…Ù„.');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	
//	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`Ù„Ø§ Ø£Ø³ØªØ·ÙŠØ¹ Ø¯Ø®ÙˆÙ„ Ù‡Ø°Ø¢ Ø§Ù„Ø±ÙˆÙ… ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(` **${song.title}** ØªÙ… Ø§Ø¶Ø§ÙÙ‡ Ø§Ù„Ø§ØºÙ†ÙŠØ© Ø§Ù„ÙŠ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`Ø¨Ø¯Ø¡ ØªØ´ØºÙŠÙ„ : **${song.title}**`);
}
const adminprefix = "-v";
const devs = ['349616310734553088','335027415619338240'];
client.on('message', message => {
  var argresult = message.content.split(` `).slice(1).join(' ');
    if (!devs.includes(message.author.id)) return;
     
  if (message.content.startsWith(adminprefix + 'setname')) {
client.user.setUsername(argresult).then
    message.channel.sendMessage(`**${argresult}** : ØªÙ… ØªØºÙŠÙŠØ± Ø£Ø³Ù… Ø§Ù„Ø¨ÙˆØª Ø¥Ù„Ù‰`)
return message.reply("**Ù„Ø§ ÙŠÙ…ÙƒÙ†Ùƒ ØªØºÙŠÙŠØ± Ø§Ù„Ø§Ø³Ù… ÙŠØ¬Ø¨ Ø¹Ù„ÙŠÙƒ Ø§Ù„Ø§Ù†ØªØ¸Ø¢Ø± Ù„Ù…Ø¯Ø© Ø³Ø§Ø¹ØªÙŠÙ† . **");
} else
  if (message.content.startsWith(adminprefix + 'setavatar')) {
client.user.setAvatar(argresult);
  message.channel.sendMessage(`**${argresult}** : ØªÙ… ØªØºÙŠØ± ØµÙˆØ±Ø© Ø§Ù„Ø¨ÙˆØª`);
      } 
});















client.login(process.env.BOT_TOKEN);
