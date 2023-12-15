import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { logger } from '$lib/server/logger';

export function POST(request: RequestEvent) {
	request.cookies.delete('Authorization', { path: '/' });
	logger.info(`user ${request.locals.email} logged out`);
	throw redirect(302, '/');
}
