import type { Actions } from '@sveltejs/kit'
import { fail, redirect } from '@sveltejs/kit'
import { repository } from '$lib/server/db'
import type { FullUser } from '../../domain'
import { FormStatus, Role } from '../../domain'
import { createSignupJwt, generateOpendkim, hashPassword } from "$lib/crypto";
import crypto from 'node:crypto'
import { activationMail, getEmailDomain, passwordMail } from '$lib/email'
import { mailer } from '$lib/server/mailer'
import { logger } from '$lib/server/logger'
import dayjs from 'dayjs'

export const prerender = false

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData()
		const email = data.get('email')?.toString()
		const password = data.get('password')?.toString()
		if (email === undefined || password === undefined) {
			return fail(400, { email, status: FormStatus.Error, code: 'signup.errors.empty_username' })
		}
		const uuid = crypto.randomUUID()
		const user: FullUser = {
			email,
			password: hashPassword(password),
			password_code: hashPassword(uuid),
			firstname: '',
			lastname: '',
			role: Role.Temporary,
			creation_date: dayjs().toDate(),
			vdomain_id: 0
		}
		const dkimKeyPair = await generateOpendkim()
		try {
			await repository.saveUserAndDomain(user,
				{
					name: getEmailDomain(email),
					dkim_selector: 'dkim',
					dkim_private_key: dkimKeyPair.privateKey,
					dkim_public_key: dkimKeyPair.publicKey,
					available: false
				})
		} catch (e) {
			console.log(e)
		}

		let result = await mailer.sendMail(activationMail(email, await createSignupJwt(user)))
		logger.info('activation message sent: %s', result.messageId)

		result = await mailer.sendMail(passwordMail(email, uuid))
		logger.info('password message sent: %s', result.messageId)

		throw redirect(307, `signup_complete?code=${uuid}&email=${email}`)
	}
}
