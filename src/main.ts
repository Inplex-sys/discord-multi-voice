import "dotenv/config";

import chalk from "chalk";
import { Client } from "discord.js-selfbot-v13";

import Ping from "@Commands/ping";
import Voice from "@Commands/voice";
import Logs from "@Utils/Logs";

const client = new Client();

const commands = [Ping, Voice];

client.on("ready", async () => {
	if (!client.user || !client.user.username) {
		Logs.Error(
			"❌ Something went wrong while logging in, double check your token and try again."
		);

		process.exit(1);
	}

	Logs.Success(`✅ Logged in as ${client.user.username}`);
});

client.on("messageCreate", async (message) => {
	if (message.author.id !== client.user?.id) return;

	const command = commands.find((c) =>
		message.content.startsWith(`&${c.metadata.name}`)
	);

	if (!command) return;

	const instance = new command(message);
	await instance.execute();

	Logs.Info(
		`${chalk.magenta("[" + message.author.username + "]")} &${
			command.metadata.name
		}`
	);
});

client.login(Bun.env.TOKEN);
