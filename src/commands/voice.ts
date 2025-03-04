import Command from "@Commands/command";

import type { Message } from "discord.js-selfbot-v13";

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

		const voiceChannel = this.message.guild?.channels.cache.find(
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

		this.message.client.ws.shards.get(0)?.send({
			op: 4,
			d: {
				guild_id: guildId,
				channel_id: channelId,
				self_mute: false,
				self_deaf: true,
			},
		});
	}
}
