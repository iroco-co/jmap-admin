import type { Knex } from 'knex'
import type {
  Alias,
  FullUser,
  Mandate,
  Subscription,
  User,
  UserEvent,
  VirtualDomain,
  BareUserEvent
} from '../../domain'
import { Role } from '../../domain'
import dayjs from 'dayjs'
import type { EventType } from '../../domain'

export class Repository {
  db: Knex<any, unknown[]>
  constructor(dataSource: Knex<any, unknown[]>) {
    this.db = dataSource
  }

  async saveUser(user: FullUser) {
    return this.db('user').insert<FullUser>(user)
  }

  async getUser(email: string): Promise<User | undefined> {
    return this.db
      .select('email', 'lastname', 'firstname', 'vdomain_id', 'creation_date', 'role')
      .from<User>('user')
      .where('email', email)
      .first()
  }

  async getFullUser(email: string): Promise<FullUser | undefined> {
    return this.db.select('*').from<FullUser>('user').where('email', email).first()
  }

  async getAliases(email: string): Promise<Array<Alias>> {
    return this.db.select('*').from<Alias>('virtual_alias').where('destination', email)
  }

  async getDomain(domain_str: string): Promise<VirtualDomain | undefined> {
    return this.db
      .select('*')
      .from<VirtualDomain>('virtual_domain')
      .where('name', domain_str)
      .first()
  }

  async getAvailableDomains(): Promise<Array<VirtualDomain>> {
    return this.db.select('*').from<VirtualDomain>('virtual_domain').where('available', true)
  }

  async getUserByEmailLike(likeExpr: string): Promise<Array<User>> {
    return this.db
      .select('email', 'lastname', 'firstname', 'vdomain_id', 'creation_date', 'role')
      .from<User>('user')
      .whereLike('email', likeExpr)
  }

  async saveAlias(alias: Alias) {
    return this.db('virtual_alias').insert<Alias>(alias)
  }

  async deleteAlias(aliasEmail: string) {
    return this.db('virtual_alias').delete<Alias>().where('source', aliasEmail)
  }

  async updatePassword(email: string, newPasswordHash: string) {
    return this.db('user').where('email', email).update('password', newPasswordHash)
  }

  async updateUserRole(email: string, role: Role) {
    return this.db('user').where('email', email).update('role', role)
  }

  async updatePasswordAndCode(email: string, newPasswordHash: string, newCodeHash: string) {
    return this.db('user')
      .where('email', email)
      .update('password', newPasswordHash)
      .update('password_code', newCodeHash)
  }

  async getMandate(email: string): Promise<Mandate | undefined> {
    return this.db
      .select('*')
      .from<Mandate>('mandate')
      .where('user_email', email)
      .orderBy('creation_date', 'desc')
      .first()
  }

  async saveMandate(mandate: Mandate) {
    return this.db('mandate').insert<Mandate>(mandate)
  }

  async deleteUser(email: string) {
    return this.db('user').delete<User>().where('email', email)
  }

  async deleteMandate(id: string) {
    return this.db('mandate').delete<Mandate>().where('id', id)
  }

  async getSubscriptions(): Promise<Array<Subscription>> {
    return this.db.select('*').from<Subscription>('subscription').where('available', true)
  }

  async getSubscription(subscriptionId: number): Promise<Subscription | undefined> {
    return this.db
      .select('*')
      .from<Subscription>('subscription')
      .where('id', subscriptionId)
      .first()
  }

  async updateUser(email: string, fields: Map<string, object>) {
    return this.db('user').where('email', email).update(fields)
  }

  async getEmailsWithCreationDateBetween(
    delayDays: number,
    butNotMoreThan: number
  ): Promise<Array<Pick<User, 'email'>>> {
    return this.db('user')
      .select('email')
      .where('creation_date', '<=', dayjs().add(-delayDays, 'days').toISOString())
      .where('creation_date', '>', dayjs().add(-butNotMoreThan, 'days').toISOString())
      .where(function () {
        this.where('role', Role.Temporary).orWhere('role', Role.Trial)
      })
  }

  async saveUserEvent(event: UserEvent | BareUserEvent) {
    return this.db('event').insert<UserEvent>(event)
  }

  async getEvent(type: EventType, email: string): Promise<UserEvent | undefined> {
    return this.db('event').select().where('type', type).where('user_id', email).first()
  }

  async saveUserAndDomain(user: FullUser, domain: VirtualDomain) {
    return this.db.transaction(async trx => {
      const result = await this.db('virtual_domain').insert<VirtualDomain>(domain).
                                            transacting(trx).
                                            returning<Partial<VirtualDomain>>('id');
      user.vdomain_id = <number>result.id
      await this.db('user').insert<FullUser>(user).transacting(trx);
    })
  }
}