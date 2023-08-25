import type { Handle } from '@sveltejs/kit'
import { jwtVerify } from 'jose'
import { redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { isSignupJwt } from '$lib/crypto'
import { logger } from '$lib/server/logger'
import { locale } from 'svelte-i18n'
import { defaultLocale } from '$lib/i18n'
import { npm_package_version } from '$env/static/private'
import type { JwtPayload } from "./domain";

const LOGIN_URL='/login'
export const handle: Handle = async function ({ event, resolve }) {
	if (event.url.pathname.startsWith('/account')) {
		const jwt = event.cookies.get('Authorization')
		if (jwt === undefined) {
			throw redirect(301, LOGIN_URL)
		}
		const secret = new TextEncoder().encode(env.JWT_SECRET)
		const { payload } = await jwtVerify(jwt, secret, {
			issuer: 'urn:iroco:issuer'
		}).catch((reason) => {
			logger.error(reason)
			event.cookies.delete('Authorization', { path: '/' })
			throw redirect(301, LOGIN_URL)
		})
		if (!payload.sub || isSignupJwt(<JwtPayload>payload)) {
			event.cookies.delete('Authorization', { path: '/' })
			throw redirect(301, LOGIN_URL)
		}
		const headerLang = event.request.headers.get('accept-language')?.split(',')[0]
		const lang = headerLang ?? defaultLocale
		locale.set(lang)
		event.locals.lang = lang
		event.locals.email = payload.sub
		event.locals.version = npm_package_version
	}
	return resolve(event)
}
