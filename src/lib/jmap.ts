import { env } from '$env/dynamic/private';
import {logger} from "$lib/server/logger";

export type MethodName =
	| 'Quota/get'
	| 'SieveScript/get'
	| 'SieveScript/set'
	| 'Principal/get'
	| 'Calendar/get'
	| 'AddressBook/get'
	| 'Admin/createAccount'
;

export type MethodCall = {
	methodName: MethodName;
	args: Arguments;
};

export type Arguments = GetArguments<EntityProperties> | SetArguments<EntityProperties>;

export type IErrorName = 'error';

export interface AccountId {
	accountId: string;
}

export interface IEmailBodyValue {
	value: string;
	isEncodingProblem: boolean;
	isTruncated: boolean;
}

/**
 * See https://jmap.io/spec-mail.html#properties-of-the-email-object
 */
export interface IEmailAddress {
	name: string;
	email: string;
}

/**
 * See https://jmap.io/spec-sharing.html#principals
 */
export type PrincipalType = 'individual' | 'group' | 'resource' | 'location' | 'other';

/**
 * See https://jmap.io/spec-sharing.html#principals
 */
export interface Principal {
	id: string;
	type: PrincipalType;
	name: string;
	description: string | null;
	email: string | null;
	timeZone: string | null;
	capabilities: Map<string, object>;
	accounts: string[];
}

/**
 * See https://jmap.io/spec-core.html#get
 */
export interface GetArguments<Properties extends EntityProperties> {
	ids: string[] | null;
	accountId?: string;
	properties?: (keyof Properties)[];
}

/**
 * See https://jmap.io/spec-core.html#set
 */
export interface SetArguments<Properties extends EntityProperties> extends AccountId {
	ifInState?: string;
	create?: { [id: string]: Partial<Properties> };
	update?: { [id: string]: Partial<Properties> & { [jsonPointer: string]: unknown } };
	onSuccessActivateScript?: string | null;
	destroy?: string[];
}

export type EntityProperties = SieveScript;

export type Quota = {
	id: string;
	used: number;
	total: number;
};

export type SieveScript = {
	id: string;
	name: string;
	isActive: boolean;
	blobId: string;
};

export type Response<T> = {
	state: string;
	list: T[];
	notfound: string[];
	accountId: string;
};

/**
 * see https://jmap.io/spec-contacts.html#addressbooks
 */
export type AddressBookRights = {
	mayRead: boolean;
	mayWrite: boolean;
	mayAdmin: boolean;
	mayDelete: boolean;
};

export type AddressBook = {
	id: string;
	name: string;
	isSubscribed: boolean;
	shareWith: Map<string, AddressBookRights>;
	myRights: AddressBookRights;
};

/**
 * see https://jmap.io/spec-calendars.html#calendars
 */
export type CalendarAlert = {
	uid: string;
	accountId: string;
	calendarEventId: string;
	recurrenceId: Date | null;
	alertId: string;
};

export type IncludeInAvailabilityType = 'all' | 'attending' | 'none';
export type CalendarRights = {
	mayReadFreeBusy: boolean;
	mayReadItems: boolean;
	mayWriteAll: boolean;
	mayWriteOwn: boolean;
	mayUpdatePrivate: boolean;
	mayRSVP: boolean;
	mayAdmin: boolean;
	mayDelete: boolean;
};

export type Calendar = {
	id: string;
	name: string;
	description: string | null;
	sortOrder: number;
	isVisible: boolean;
	isSubscribed: boolean;
	includeInAvailability: IncludeInAvailabilityType;
	defaultAlertsWithTime: Map<string, CalendarAlert> | null;
	defaultAlertsWithoutTime: Map<string, CalendarAlert> | null;
	timeZone: string | null;
	myRights: CalendarRights;
	shareWith: Map<string, CalendarRights>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type Status = {};

export class Account {
}

export async function createAccount(adminId: string, jwt: string, accountId: string): Promise<Response<Account>> {
	return request<Response<Quota>>(
		jwt,
		['https://cyrusimap.org/ns/jmap/admin'],
		[{ methodName: 'Admin/createAccount', args: { accountId, ids: null } }]
	);
}

export async function getQuota(accountId: string, jwt: string): Promise<Response<Quota>> {
	return request<Response<Quota>>(
		jwt,
		['https://cyrusimap.org/ns/jmap/quota'],
		[{ methodName: 'Quota/get', args: { accountId, ids: null } }]
	);
}

export async function getSieveScripts(
	accountId: string,
	jwt: string,
	ids: string[] | null = null
): Promise<Response<SieveScript>> {
	return request<Array<SieveScript>>(
		jwt,
		['https://cyrusimap.org/ns/jmap/sieve'],
		[{ methodName: 'SieveScript/get', args: { accountId: accountId, ids } }]
	);
}

export async function saveSieveScript(
	accountId: string,
	jwt: string,
	name: string,
	script: string,
	scriptId: string | null
): Promise<Status> {
	let args: Arguments;
	if (scriptId == null) {
		const uploadResp = await fetch(`${env.JMAP_URL}/upload/${accountId}/`, {
			method: 'POST',
			body: script,
			headers: { 'Content-Type': 'application/sieve', Authorization: `Bearer ${jwt}` }
		});
		const upload = await uploadResp.json();
		args = {
			accountId: accountId,
			create: { A: { name: name, blobId: upload.blobId } },
			onSuccessActivateScript: '#A'
		};
	} else {
		args = {
			accountId: accountId,
			onSuccessActivateScript: scriptId
		};
	}

	return await request<Status>(
		jwt,
		['urn:ietf:params:jmap:core', 'https://cyrusimap.org/ns/jmap/sieve'],
		[{ methodName: 'SieveScript/set', args }]
	);
}

export async function destroySieveScript(
	accountId: string,
	jwt: string,
	scriptId: string
): Promise<Status> {
	const jmapMethodCalls = [
		{
			methodName: <MethodName>'SieveScript/set',
			args: {
				accountId: accountId,
				onSuccessActivateScript: null
			}
		},
		{
			methodName: <MethodName>'SieveScript/set',
			args: {
				accountId: accountId,
				destroy: [scriptId]
			}
		}
	];
	return await request(
		jwt,
		['urn:ietf:params:jmap:core', 'https://cyrusimap.org/ns/jmap/sieve'],
		jmapMethodCalls
	);
}

export async function getSieveScriptContent(
	accountId: string,
	jwt: string,
	blobId: string,
	name: string
): Promise<string> {
	const response = await fetch(
		`${env.JMAP_URL}/download/${accountId}/${blobId}/${name}.siv?accept=application/sieve`,
		{ headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' } }
	);
	return await response.text();
}

export function getCalendars(jwt: string): Promise<Response<Calendar>> {
	return request<Response<Calendar>>(
		jwt,
		['urn:ietf:params:jmap:calendars'],
		[{ methodName: 'Calendar/get', args: { ids: null } }]
	);
}

export function getAddressBooks(jwt: string): Promise<Response<AddressBook>> {
	return request<Response<AddressBook>>(
		jwt,
		['urn:ietf:params:jmap:contacts'],
		[{ methodName: 'AddressBook/get', args: { ids: null } }]
	);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function request<ResponseType>(jwt: string, using: string[], jmapMethodCalls: MethodCall[]) {
	const methodCalls = [];
	for (let i = 0; i < jmapMethodCalls.length; i++) {
		methodCalls.push([jmapMethodCalls[i].methodName, jmapMethodCalls[i].args, String(i)]);
	}

	let response: any;
	try {
		response = await fetch(env.JMAP_URL, {
			method: 'POST',
			headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ using, methodCalls })
		});
	} catch (e) {
		logger.error("JMAP request failed", e)
		throw e
	}

	if (response.status !== 200) {
		const body = await response.text();
		throw Error(body);
	} else {
		const jsonResponse = await response.json();
		const methodResponse = jsonResponse.methodResponses[0];

		if (methodResponse[0] === 'error') {
			throw methodResponse[1];
		}

		return methodResponse[1];
	}
}
