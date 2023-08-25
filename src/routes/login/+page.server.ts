import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { repository } from '$lib/server/db';
import { FormStatus } from '../../domain';
import { createJwt, verifyPassword } from '$lib/crypto';
import { logger } from '$lib/server/logger';
import { env } from '$env/dynamic/private';
import dayjs from 'dayjs';
import { PUBLIC_SESSION_DURATION_MN } from '$env/static/public';
export const prerender = false;

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const redirectUrl = data.get('redirect_url') ?? '/account';

		if (!email) {
			return fail(400, { email, status: FormStatus.Error, code: 'login.errors.empty_email' });
		}
		const user = await repository.getFullUser(email.toString());

		if (!user || !password || !verifyPassword(password.toString(), user.password)) {
			logger.info(`invalid credentials for ${email} returning 401`);
			return fail(401, { email, status: FormStatus.Error, code: 'err.invalid_credentials' });
		}

		const secret = new TextEncoder().encode(env.JWT_SECRET);
		const expirationDate = dayjs().add(Number(PUBLIC_SESSION_DURATION_MN), 'minutes').toDate();
		const jwt = await createJwt(user, expirationDate, secret);

		cookies.set('Authorization', jwt, {
			httpOnly: true,
			secure: true,
			expires: expirationDate,
			sameSite: 'lax',
			path: '/'
		});
		logger.info(`user ${email} logged in`);
		throw redirect(302, redirectUrl.toString());
	}
};
