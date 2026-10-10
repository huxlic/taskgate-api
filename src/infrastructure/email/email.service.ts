import Handlebars from "handlebars";
import path from "node:path";
import * as fs from "node:fs/promises";
import {convert} from "html-to-text"
import type {SendVerificationEmailInput} from "./email.types.ts";
import {sendMail} from "./mailer.ts";

export const sendVerificationEmail = async ({
	                                            to,
	                                            name,
	                                            otp,
	                                            expiresInMinutes,
	                                            currentYear = new Date().getFullYear()
                                            }: SendVerificationEmailInput) => {
	const source = await fs.readFile(path.join(import.meta.dirname, "./templates/verify-email.hbs"), "utf8")
	
	const template = Handlebars.compile(source);
	const html = template({name, otp, expiresInMinutes, currentYear});
	const text = convert(html);
	
	await sendMail({to, subject: "Verify your email", text, html})
}