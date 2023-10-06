// @vitest-environment node
import { repository } from '../../src/lib/server/db';
import { request } from 'svelte-kit-test-helpers';
import { actions } from '../../src/routes/signup/+page.server';
import { verifyPassword } from '../../src/lib/crypto';
import type { ParsedMail } from 'mailparser';
import { createForm } from '../../src/lib/forms';
import { env } from '$env/dynamic/private';
import { Role } from '../../src/domain';
import { jwtVerify } from 'jose';
import { PUBLIC_TRIAL_PERIOD_DAYS } from '$env/static/public';
import { createSmtpServer } from '../emailUtil';

const mailQueue: Array<ParsedMail> = [];
const server = createSmtpServer(mailQueue);
beforeAll(() => {
	server.listen({ hostname: 'localhost', port: env.MAILER_PORT });
});

afterAll(() => {
	server.close();
});

afterEach(async () => {
	await repository.db('user').del();
	await repository.db('virtual_domain').del();
	mailQueue.splice(0, mailQueue.length);
});

test('signup should return 400 with empty form', async () => {
	const response = await request(actions.default, { body: new FormData() });
	expect(response.status).toBe(400);
});

test('signup should create a user with temporary status', async () => {
	try {
		await request(actions.default, {
			body: createForm({ email: 'foo@bar.com', password: 'password' })
		});
	} catch (response) {
		console.log(response);
		expect(response.status).toBe(307);
		expect(response.location).toMatch(/signup_complete\?code=[0-9a-z-]+/);
	}

	const actualUser = await repository.getFullUser('foo@bar.com');
	expect(actualUser).toBeDefined();
	expect(verifyPassword('password', actualUser.password)).toBeTruthy();
	expect(actualUser.role).toEqual(Role.Temporary);

	const actualDomain = await repository.getDomain('bar.com');
	expect(actualDomain).toBeDefined();
	expect(actualDomain.dkim_selector).toEqual('dkim');
	expect(actualDomain.dkim_private_key).toBeDefined();
	expect(actualDomain.dkim_public_key).toBeDefined();
	expect(actualDomain.available).toBeFalsy();
	expect(actualUser.vdomain_id).toEqual(actualDomain.id);
});

test('signup should send an activation mail and password recovery code', async () => {
	let match;
	try {
		await request(actions.default, {
			body: createForm({ email: 'baz@iroco.co', password: 'pass' })
		});
	} catch (response) {
		expect(response.status).toBe(307);
		match = response.location.match(/signup_complete\?code=([0-9a-z-]+)/);
	}

	expect(mailQueue).toHaveLength(2);

	const passwordMsg = mailQueue.pop();
	expect(passwordMsg).toBeDefined();
	expect(passwordMsg.subject).toContain('IMPORTANT');
	expect(passwordMsg.from.text).toEqual('support@iroco.fr');
	expect(passwordMsg.text).toContain(match[1]);

	const activationMsg = mailQueue.pop();
	expect(activationMsg).toBeDefined();
	expect(passwordMsg.subject).toContain('IMPORTANT');
	expect(passwordMsg.from.text).toEqual('support@iroco.fr');
	match = activationMsg.text.match(/signup_confirm\?token=([\w-]*\.[\w-]*\.[\w-]*)/);
	expect(match).not.toBeNull();
	const jwt = match[1];
	const { payload } = await jwtVerify(jwt, new TextEncoder().encode(env.JWT_SECRET));
	expect(payload).not.toBeNull();
	expect(payload.exp - payload.iat).toEqual(PUBLIC_TRIAL_PERIOD_DAYS * 24 * 60 * 60 + 5);
	expect(payload.sub).toEqual('baz@iroco.co');
});
