import nodemailer from "nodemailer";
import {config} from "../../config/index.ts";
import type {MailInput} from "./email.types.ts";

export const transporter = nodemailer.createTransport({
	host: config.smtp.host,
	port: 587,
	secure: false,
	auth: {
		user: config.smtp.user,
		pass: config.smtp.pass,
	},
});

export const sendMail = async ({to, subject, text, html}: MailInput) => {
	return await transporter.sendMail({
		from: config.smtp.from,
		to,
		subject,
		text,
		html
	})
}