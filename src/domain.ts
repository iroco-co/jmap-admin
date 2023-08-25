export type Alias = {
	source: string
	destination: string
	id: number | undefined
}

export enum Role {
	Temporary,
	Trial,
	User,
	Admin,
	SuperAdmin
}

export type User = {
	email: string
	lastname: string
	firstname: string
	role: Role
	vdomain_id: number
	creation_date: Date
}

export type FullUser = User & {
	password: string
	password_code: string
}

export type Mandate = {
	id: string
	user_email: string
	creation_date: Date
}

export type Payment = {
	id: string
	created_at: Date
	charge_date: string
	amount: number
	description: string
	currency: string
	status: string
}

export enum FormStatus {
	OK,
	Error
}

export type VirtualDomain = {
	id?: number
	name: string
	dkim_selector: string
	dkim_private_key: string
	dkim_public_key: string
	available: boolean
}

export type Email = {
	from: string
	to: string
	subject: string
	text: string | undefined
	html: string | undefined
}

export type Subscription = {
	id: number
	name: string | null
	amount: number
	currency: Currency
	locale: Intl.Locale
	period: Period
	quantity: number
	available: boolean
}

export enum Currency {
	EURO = 'EUR',
	DOLLAR = 'DOL'
}

export enum Period {
	MONTH,
	YEAR
}

export type JwtPayload = {
	sub: string
	role: Role
	iat: number
	exp: number
}

export type UserEvent = {
	user_id: string
	type: EventType
	ts: Date
}

export type BareUserEvent = Optional<UserEvent, 'ts'>

export enum EventType {
	EMAIL_15J,
	EMAIL_21J,
	EMAIL_25J,
	EMAIL_29J,
	ACCOUNT_REMOVED
}

export type GenericObject = { [key: string]: any }
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type KeyPair = {
	publicKey: string
	privateKey: string
}