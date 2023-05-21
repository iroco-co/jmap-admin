import nodemailer from 'nodemailer'
import { env } from '$env/dynamic/private'

export const mailer = nodemailer.createTransport({
	host: env.MAILER_HOST,
	port: Number(env.MAILER_PORT),
	secure: false,
	ignoreTLS: true
})
