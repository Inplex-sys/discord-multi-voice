export default class Credits {
	public static Append(message: string): string {
		return (
			message +
			"\n-# This message has been generated by **Selfcord**, more info on [GitHub](<https://github.com/Inplex-sys/selfcord/>)."
		);
	}
}
