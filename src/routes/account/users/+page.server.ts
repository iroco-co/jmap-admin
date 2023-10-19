import type { Actions, ServerLoad } from '@sveltejs/kit';
import { repository } from '$lib/server/db';
import { getEmailDomain } from '$lib/email';
import crypto from 'node:crypto';
import { FormStatus, Role } from '../../../domain';
import { hashPassword } from '$lib/crypto';

export const prerender = false;
export const load: ServerLoad = async (event) => {
	event.depends('user:create', 'user:delete');
	return {
		users: await repository.getUsers(getEmailDomain(event.locals.email)),
		uuid: crypto.randomUUID()
	};
};

export const actions: Actions = {
	addUser: async ({ request, locals }) => {
		const {
			user_email,
			user_password,
			user_role,
			user_password_code,
			user_first_name,
			user_last_name
		} = Object.fromEntries(await request.formData());

		const domain = await repository.getDomain(getEmailDomain(locals.email));

		if (domain !== undefined && domain.name === getEmailDomain(<string>user_email)) {
			await repository.saveUser({
				email: <string>user_email,
				password: hashPassword(<string>user_password),
				role: Role[user_role],
				firstname: <string>user_first_name,
				lastname: <string>user_last_name,
				password_code: hashPassword(<string>user_password_code),
				vdomain_id: <number>domain.id,
				creation_date: new Date()
			});
			return { status: FormStatus.OK };
		}
	},

	deleteUser: async ({ request, locals }) => {
		const { user_email } = Object.fromEntries(await request.formData());
		const domain = await repository.getDomain(getEmailDomain(locals.email));
		if (domain !== undefined && domain.name === getEmailDomain(<string>user_email)) {
			await repository.deleteAliases(<string>user_email);
			await repository.deleteUser(<string>user_email);
			return { status: FormStatus.OK };
		}
	}
};
