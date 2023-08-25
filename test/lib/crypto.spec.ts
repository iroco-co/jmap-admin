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
import dayjs from 'dayjs';
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
		creation_date: dayjs().toDate(),
		vdomain_id: 1
	};
	const secret = new TextEncoder().encode(env.JWT_SECRET);
	const jwt = await createSignupJwt(user);
	const actualJwt = await jwtVerify(jwt, secret, { issuer: 'urn:iroco:issuer' });
	expect(isSignupJwt(<JwtPayload>actualJwt.payload)).toBeTruthy();
});

test('remove PEM marks', () => {
	expect(
		removePemMarks('-----BEGIN PUBLIC KEY-----\nfoo\n-----BEGIN ENCRYPTED PRIVATE KEY-----')
	).toEqual('foo');
});

test('generate DKIM keypair', async () => {
	const keypair = await generateOpendkim();
	expect(keypair.publicKey).toBeDefined();
	expect(keypair.privateKey).toBeDefined();
	expect(keypair.publicKey.startsWith('-----BEGIN RSA PUBLIC KEY-----')).toBeTruthy();
	expect(keypair.privateKey.startsWith('-----BEGIN RSA PRIVATE KEY-----')).toBeTruthy();
});
