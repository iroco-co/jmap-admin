import type { Email } from '../domain'
import { createTemplate } from '$lib/strings'
import welcomeMailText from '../templates/mail_welcome.txt.tpl?raw'
import welcomeMailHtml from '../templates/mail_welcome.html.tpl?raw'
import activationMailText from '../templates/mail_activation.txt.tpl?raw'
import passwordMailHtml from '../templates/mail_password.txt.tpl?raw'

export function isEmailValid(email: string): boolean {
	// see https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
	// eslint-disable-next-line no-control-regex
	return /^(?:[a-z0-9!#$%&'*/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
		email
	)
}

export const isSuffixValid = (emailSuffix: string): boolean => {
	return /^[a-z0-9]+$/i.test(emailSuffix)
}
export const getEmailBase = (email: string): string => {
	return email.split('@')[0]
}
export const getEmailDomain = (email: string): string => {
	return email.split('@')[1]
}

export const composeLocalPart = (base: string, suffix: string): string => {
	return `${base}+${suffix}`
}

export function passwordMail(email: string, reset_password_code: string): Email {
	return {
		from: 'support@iroco.fr',
		to: email,
		subject: 'IMPORTANT : votre code de récupération à conserver',
		text: createTemplate(passwordMailHtml)({ reset_password_code }),
		html: undefined
	}
}

export function activationMail(email: string, token: string): Email {
	return {
		from: 'support@iroco.fr',
		to: email,
		subject: 'IMPORTANT : activation de votre compte',
		text: createTemplate(activationMailText)({ token }),
		html: undefined
	}
}

export function welcomeMail(email: string): Email {
	return {
		from: 'hello@iroco.fr',
		to: email,
		subject: 'Bienvenue chez Iroco',
		text: welcomeMailText,
		html: welcomeMailHtml
	}
}
