import {createHmac} from "node:crypto";
import {config} from "../../config/index.ts";

export const hashCode = (code: string) => {
	const secret = config.hmac.secret;
	
	return createHmac("sha256", secret)
		.update(code)
		.digest("hex")
}