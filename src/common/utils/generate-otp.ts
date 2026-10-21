import {randomInt} from "node:crypto";

export const generateOtp = (): string => {
	const code = randomInt(1, 1_000_000).toString().padStart(6, "0")
	console.log(code)
	
	return code
}