import type { Handle } from '@sveltejs/kit';
import { jwtVerify } from 'jose';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { logger } from '$lib/server/logger';
import { locale } from 'svelte-i18n';
import { defaultLocale } from '$lib/i18n';
import { Role } from './domain';

export const handle: Handle = async function ({ event, resolve }) {
	if (event.url.pathname.startsWith('/account')) {
		const jwt = event.cookies.get('Authorization');
		if (jwt === undefined) {
			throw error(401, 'no token');
		}
		const secret = new TextEncoder().encode(env.JWT_SECRET);
		const { payload } = await jwtVerify(jwt, secret, {
			issuer: 'urn:iroco:issuer'
		}).catch((reason) => {
			logger.error(reason);
			event.cookies.delete('Authorization', { path: '/' });
			throw error(401, 'invalid JWT');
		});
		if (!payload.sub) {
			event.cookies.delete('Authorization', { path: '/' });
			throw error(401, 'invalid JWT payload');
		}
		if (payload.role !== Role.Admin) {
			event.cookies.delete('Authorization', { path: '/' });
			throw error(403, 'unauthorized');
		}
		const headerLang = event.request.headers.get('accept-language')?.split(',')[0];
		const lang = headerLang ?? defaultLocale;
		locale.set(lang);
		event.locals.lang = lang;
		event.locals.email = payload.sub;
		event.locals.role = payload.role;
	}
	return resolve(event);
};
