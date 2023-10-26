export enum Role {
	Temporary,
	Trial,
	User,
	Admin,
	SuperAdmin
}

export enum FormStatus {
	OK,
	Error
}

export type Email = {
	from: string;
	to: string;
	subject: string;
	text: string | undefined;
	html: string | undefined;
};

export type JwtPayload = {
	sub: string;
	role: Role;
	iat: number;
	exp: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericObject = { [key: string]: any };
