import { Client, Message } from "discord.js-selfbot-v13";

import Command from "@Commands/command";

export default class Voice extends Command {
	public static metadata = {
		name: "voice",
		parameters: ["link"],
		description: "Join a voice channel in duplicate mode.",
		aliases: [],
	};

	constructor(message: Message) {
		super(message, Voice.metadata);
	}

	async join(guildId: string, channelId: string) {
		const client = new Client();

		client.on("ready", async () => {
			if (!client.user || !client.user.username) {
				this.message.channel.send(
					"❌ Something went wrong while logging in, double check your token and try again."
				);

				process.exit(1);
			}

			this.message.channel.send(
				`✅ Created a new client and logged in as ${client.user.username}.`
			);

			const guild = client.guilds.cache.get(guildId);
			if (!guild) {
				this.message.channel.send(
					"⚠️ The guild you provided does not exist."
				);
				return;
			}

			const voiceChannel = guild.channels.cache.find(
				(c) => c.id === channelId
			);

			if (!voiceChannel) {
				this.message.channel.send(
					"⚠️ The voice channel you provided does not exist."
				);
				return;
			}

			if (voiceChannel.type !== "GUILD_VOICE") {
				this.message.channel.send(
					"⚠️ The channel you provided is not a voice channel."
				);
				return;
			}

			client.ws.shards.get(0)?.send({
				op: 4,
				d: {
					guild_id: guildId,
					channel_id: channelId,
					self_mute: false,
					self_deaf: true,
				},
			});
		});

		client.login(process.env.TOKEN);
	}

	async execute() {
		const parameters = await this.getParameters();
		if (parameters.length != this.parameters.length) {
			this.message.channel.send(
				`⚠️ You must provide the following parameters: ${this.parameters.join(
					", "
				)}.`
			);
			return;
		}

		const [link] = parameters;

		const [guildId, channelId] = link.split("/").slice(-2);

		if (!guildId || !channelId) {
			this.message.channel.send(
				"⚠️ The link you provided is invalid. Please provide a valid link."
			);
			return;
		}

		const guild = this.message.client.guilds.cache.get(guildId);
		if (!guild) {
			this.message.channel.send(
				"⚠️ The guild you provided does not exist."
			);
			return;
		}

		const voiceChannel = guild.channels.cache.find(
			(c) => c.id === channelId
		);

		if (!voiceChannel) {
			this.message.channel.send(
				"⚠️ The voice channel you provided does not exist."
			);
			return;
		}

		if (voiceChannel.type !== "GUILD_VOICE") {
			this.message.channel.send(
				"⚠️ The channel you provided is not a voice channel."
			);
			return;
		}

		await this.join(guildId, channelId);

		await this.message.channel.send(
			`🔊 Joined voice channel **${voiceChannel.name}** in guild **${guild.name}**.`
		);
	}
}
