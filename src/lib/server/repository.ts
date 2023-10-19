import type { Knex } from 'knex';
import type {
	Alias,
	BareUserEvent,
	EventType,
	FullUser,
	Mandate,
	Subscription,
	User,
	UserEvent,
	VirtualDomain
} from '../../domain';
import { Role } from '../../domain';
import { DateTime } from 'luxon';
import Transaction = Knex.Transaction;

export class Repository {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	db: Knex<any, unknown[]>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(dataSource: Knex<any, unknown[]>) {
		this.db = dataSource;
	}

	async saveUser(user: FullUser) {
		return this.db('user').insert<FullUser>(user);
	}

	async getUser(email: string): Promise<User | undefined> {
		return this.db
			.select('email', 'lastname', 'firstname', 'vdomain_id', 'creation_date', 'role')
			.from<User>('user')
			.where('email', email)
			.first();
	}

	async getFullUser(email: string): Promise<FullUser | undefined> {
		return this.db.select('*').from<FullUser>('user').where('email', email).first();
	}

	async getAliases(email: string): Promise<Array<Alias>> {
		return this.db.select('*').from<Alias>('virtual_alias').where('destination', email);
	}

	async getDomain(domain_str: string): Promise<VirtualDomain | undefined> {
		return this.db
			.select('*')
			.from<VirtualDomain>('virtual_domain')
			.where('name', domain_str)
			.first();
	}
	async getDomainById(domain_id: number): Promise<VirtualDomain | undefined> {
		return this.db.select('*').from<VirtualDomain>('virtual_domain').where('id', domain_id).first();
	}

	async getAvailableDomains(): Promise<Array<VirtualDomain>> {
		return this.db.select('*').from<VirtualDomain>('virtual_domain').where('available', true);
	}

	async getUserByEmailLike(likeExpr: string): Promise<Array<User>> {
		return this.db
			.select('email', 'lastname', 'firstname', 'vdomain_id', 'creation_date', 'role')
			.from<User>('user')
			.whereLike('email', likeExpr);
	}

	async saveAlias(alias: Alias) {
		return this.db('virtual_alias').insert<Alias>(alias);
	}

	async deleteAlias(aliasEmail: string) {
		return this.db('virtual_alias').delete<Alias>().where('source', aliasEmail);
	}

	async deleteAliases(destinationEmail: string) {
		return this.db('virtual_alias').delete<Alias>().where('destination', destinationEmail)
	}

	async updatePassword(email: string, newPasswordHash: string) {
		return this.db('user').where('email', email).update('password', newPasswordHash);
	}

	async updateUserRole(email: string, role: Role) {
		return this.db('user').where('email', email).update('role', role);
	}

	async updatePasswordAndCode(email: string, newPasswordHash: string, newCodeHash: string) {
		return this.db('user')
			.where('email', email)
			.update('password', newPasswordHash)
			.update('password_code', newCodeHash);
	}

	async getMandate(email: string): Promise<Mandate | undefined> {
		return this.db
			.select('*')
			.from<Mandate>('mandate')
			.where('user_email', email)
			.orderBy('creation_date', 'desc')
			.first();
	}

	async saveMandate(mandate: Mandate) {
		return this.db('mandate').insert<Mandate>(mandate);
	}

	async deleteUser(email: string) {
		return this.db('user').delete<User>().where('email', email);
	}

	async deleteMandate(id: string) {
		return this.db('mandate').delete<Mandate>().where('id', id);
	}

	async getSubscriptions(): Promise<Array<Subscription>> {
		return this.db.select('*').from<Subscription>('subscription').where('available', true);
	}

	async getSubscription(subscriptionId: number): Promise<Subscription | undefined> {
		return this.db
			.select('*')
			.from<Subscription>('subscription')
			.where('id', subscriptionId)
			.first();
	}

	async updateUser(email: string, fields: Map<string, object>) {
		return this.db('user').where('email', email).update(fields);
	}

	async getEmailsWithCreationDateBetween(
		delayDays: number,
		butNotMoreThan: number
	): Promise<Array<Pick<User, 'email'>>> {
		return this.db('user')
			.select('email')
			.where('creation_date', '<=', DateTime.now().minus({ days: delayDays }).toISO())
			.where('creation_date', '>', DateTime.now().minus({ days: butNotMoreThan }).toISO())
			.where(function () {
				this.where('role', Role.Temporary).orWhere('role', Role.Trial);
			});
	}

	async saveUserEvent(event: UserEvent | BareUserEvent) {
		return this.db('event').insert<UserEvent>(event);
	}

	async getEvent(type: EventType, email: string): Promise<UserEvent | undefined> {
		return this.db('event').select().where('type', type).where('user_id', email).first();
	}

	async saveUserAndDomain(user: FullUser, domain: VirtualDomain) {
		return this.db.transaction(async (trx) => {
			user.vdomain_id = await this.saveDomain(domain, trx);
			await this.db('user').insert<FullUser>(user).transacting(trx);
		});
	}

	async getUsers(emailDomain: string) {
		return this.db
			.select('*')
			.from<User>('user')
			.join('virtual_domain', 'user.vdomain_id', 'virtual_domain.id')
			.where('virtual_domain.name', emailDomain);
	}

	async saveDomain(domain: VirtualDomain, transaction: Transaction | null = null): Promise<number> {
		const local_db = this.db('virtual_domain');
		if (transaction !== null) {
			local_db.transacting(transaction);
		}
		const results = await local_db.insert<VirtualDomain>(domain).returning('id');

		return results[0].id;
	}
}
