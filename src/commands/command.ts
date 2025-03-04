import type { Message } from "discord.js-selfbot-v13";

/**
 * Base class for command implementation
 * @class Command
 */
export default class Command {
	/** The Discord message that triggered this command */
	message: Message;
	/** The name of the command */
	name: string;
	/** List of parameters the command accepts */
	parameters: string[];
	/** Description of what the command does */
	description: string;
	/** Alternative command names that can trigger this command */
	aliases: string[];

	/**
	 * Creates a new Command instance
	 * @param {Message} message - The Discord message that triggered this command
	 * @param {Object} metadata - Command metadata
	 * @param {string} metadata.name - The name of the command
	 * @param {string[]} metadata.parameters - List of parameters the command accepts
	 * @param {string} metadata.description - Description of what the command does
	 * @param {string[]} metadata.aliases - Alternative command names
	 */
	constructor(
		message: Message,
		metadata: {
			name: string;
			parameters: string[];
			description: string;
			aliases: string[];
		}
	) {
		this.message = message;
		this.name = metadata.name;
		this.parameters = metadata.parameters;
		this.description = metadata.description;
		this.aliases = metadata.aliases;
	}

	/**
	 * Extracts command parameters from the message content
	 * @returns {Promise<string[]>} Array of parameter strings from the message
	 */
	async getParameters(): Promise<string[]> {
		return this.message.content.split(" ").slice(1);
	}
}
