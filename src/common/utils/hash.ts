import bcrypt from 'bcrypt';

export const hashString = async (str: string): Promise<string> => {
	return await bcrypt.hash(str, 10);
}

export const compareHash = async (str: string, hash: string): Promise<boolean> => {
	return await bcrypt.compare(str, hash);
}