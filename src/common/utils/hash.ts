import bcrypt from 'bcrypt';

export const hashString = async (str: string): Promise<string> => {
	return await bcrypt.hash(str, 10);
}