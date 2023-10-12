import type { Actions, ServerLoad } from "@sveltejs/kit";
import { repository } from '$lib/server/db';
import { getEmailDomain } from '$lib/email';
import crypto from 'node:crypto';
import { FormStatus } from "../../../domain";
import { hashPassword } from "$lib/crypto";

export const prerender = false;
export const load: ServerLoad = async (event) => {
	return {
		users: await repository.getUsers(getEmailDomain(event.locals.email)),
		uuid: crypto.randomUUID()
	}
}

export const actions: Actions = {
	default: async ({ request }: import('./$types').RequestEvent) => {
		const { user_email, user_password, user_role,
			user_password_code, user_first_name, user_last_name } = Object.fromEntries(await request.formData())

		const domain = await repository.getDomain(getEmailDomain(<string>user_email))

		if (domain !== undefined) {
			await repository.saveUser({email: <string>user_email,
				password: hashPassword(<string>user_password), role: Number(<string>user_role),
				firstname: <string>user_first_name, lastname: <string>user_last_name,
				password_code: hashPassword(<string>user_password_code),
				vdomain_id: <number>domain.id, creation_date: new Date()
			})
			return { status: FormStatus.OK }
		}
	}
}