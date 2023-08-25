import type { PageServerLoad } from './$types';
import { repository } from '$lib/server/db';
import { getEmailDomain } from '$lib/email';
import { removePemMarks } from '$lib/crypto';

export const load: PageServerLoad = async ({ locals }) => {
	const domain = await repository.getDomain(getEmailDomain(locals.email));
	return {
		dkim_public_key: domain?.dkim_private_key ? removePemMarks(domain?.dkim_public_key) : '',
		name: domain?.name
	};
};
