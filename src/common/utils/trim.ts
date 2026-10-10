export const trim = <T extends Record<string, any>>(data: T): T => {
	const result = { ...data };
	
	for (const key in result) {
		if (typeof result[key] === "string") {
			result[key] = result[key].trim();
		}
	}
	
	return result;
};
