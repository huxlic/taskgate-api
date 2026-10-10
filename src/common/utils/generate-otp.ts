import {randomInt} from "node:crypto";

export const generateOtp = () => {
	return randomInt(1, 1_000_000).toString().padStart(6, "0")
}