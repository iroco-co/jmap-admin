// @vitest-environment node
import {
	createSignupJwt,
	generateOpendkim,
	hashPassword,
	isSignupJwt,
	removePemMarks,
	verifyPassword
} from '../../src/lib/crypto';
import { Role } from '../../src/domain';
import type { User, JwtPayload } from '../../src/domain';
import { env } from '$env/dynamic/private';
import { jwtVerify } from 'jose';

test('hash password', () => {
	expect(verifyPassword('password', hashPassword('password'))).toBeTruthy();
});

test('is JWT from signup', async () => {
	const user: User = {
		email: 'e@mail.com',
		firstname: '',
		lastname: '',
		role: Role.Temporary,
		creation_date: new Date(),
		vdomain_id: 1
	};
	const secret = new TextEncoder().encode(env.JWT_SECRET);
	const jwt = await createSignupJwt(user);
	const actualJwt = await jwtVerify(jwt, secret, { issuer: 'urn:iroco:issuer' });
	expect(isSignupJwt(<JwtPayload>actualJwt.payload)).toBeTruthy();
});
