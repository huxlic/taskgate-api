import type {PublicUser, User} from "./user.types.js";

export const toPublicUser = (user: User): PublicUser => {
	const {passwordHash, ...rest} = user;
	return rest;
}
