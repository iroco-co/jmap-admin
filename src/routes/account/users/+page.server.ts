import type { ServerLoad } from '@sveltejs/kit';
import { repository } from '$lib/server/db';
import { getEmailDomain } from '$lib/email';
import crypto from 'node:crypto';

export const prerender = false;
export const load: ServerLoad = async (event) => {
	return {
		users: await repository.getUsers(getEmailDomain(event.locals.email)),
		uuid: crypto.randomUUID()
	};
};
