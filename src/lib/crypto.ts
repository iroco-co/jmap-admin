import { sha512 } from 'sha512-crypt-ts';
import type { JwtPayload, KeyPair, User } from '../domain';
import { SignJWT } from 'jose';
import dayjs from 'dayjs';
import { Role } from '../domain';
import { PUBLIC_TRIAL_PERIOD_DAYS } from '$env/static/public';
import { env } from '$env/dynamic/private';
import { generateKeyPair } from 'crypto';

const DELTA_JWT_ISSUANCE_SEC = 5;

export const b64decode = (str: string): string => Buffer.from(str, 'base64').toString('binary');
export const b64encode = (str: string): string => Buffer.from(str, 'binary').toString('base64');

export function verifyPassword(password: string, sha512_password: string): boolean {
	const salt = getSalt(sha512_password);
	return sha512_password === sha512Password(password, salt);
}

export function hashPassword(password: string) {
	return sha512Password(password, randomSalt());
}

function sha512Password(password: string, salt: string): string {
	const payload = sha512.crypt(password, salt);
	return `{SHA512-CRYPT}${payload}`;
}

function getSalt(password_hash: string): string {
	return password_hash.replace(/{SHA512-CRYPT}\$6\$([a-zA-Z0-9+\\]+)\$.*/, '$1');
}

function randomSalt(): string {
	const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ./';
	const length = 8 + Math.random() * 8;
	let result = '';
	for (let i = length; i > 0; --i) {
		result += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return result;
}

export async function createJwt(
	user: User,
	expirationDate: Date,
	secret: Uint8Array
): Promise<string> {
	const alg = 'HS512';
	const typ = 'JWT';
	return await new SignJWT({ role: user.role })
		.setProtectedHeader({ typ, alg })
		.setSubject(user.email)
		.setIssuedAt(dayjs().add(-DELTA_JWT_ISSUANCE_SEC, 'second').unix())
		.setIssuer('urn:iroco:issuer')
		.setExpirationTime(Math.floor(expirationDate.getTime() / 1000))
		.sign(secret);
}

export async function createSignupJwt(user: User): Promise<string> {
	const expirationDate = dayjs().add(Number(PUBLIC_TRIAL_PERIOD_DAYS), 'days').toDate();
	const secret = new TextEncoder().encode(env.JWT_SECRET);
	return createJwt(user, expirationDate, secret);
}

export function isSignupJwt(jwtPayload: JwtPayload): boolean {
	return (
		jwtPayload.role !== undefined &&
		jwtPayload.iat !== undefined &&
		jwtPayload.exp !== undefined &&
		jwtPayload.role === Role.Temporary &&
		jwtPayload.exp - jwtPayload.iat ===
			Number(PUBLIC_TRIAL_PERIOD_DAYS) * 24 * 60 * 60 + DELTA_JWT_ISSUANCE_SEC
	);
}

export function generateOpendkim(): Promise<KeyPair> {
	return new Promise((resolve, reject) => {
		generateKeyPair(
			'rsa',
			{
				modulusLength: 2048,
				publicKeyEncoding: {
					type: 'pkcs1',
					format: 'pem'
				},
				privateKeyEncoding: {
					type: 'pkcs1',
					format: 'pem'
				}
			},
			(error, publicKey, privateKey) => {
				if (error) {
					reject(error);
				} else {
					resolve({ publicKey, privateKey });
				}
			}
		);
	});
}

export function removePemMarks(key: string): string {
	return key.replace(/[-]{5}[A-Z ]+[-]{5}/g, '').replace(/\n/g, '');
}
