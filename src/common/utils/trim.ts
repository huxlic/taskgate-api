export const trim = <T extends Record<string, string>>(data: T): T => {
	const entries = Object.entries(data).map(([key, value]) => [
		key,
		value.trim()
	]);
	
	return Object.fromEntries(entries) as T;
};