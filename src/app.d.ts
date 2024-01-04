// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare namespace App {
	// interface Error {}
	interface Locals {
		role: import('./domain').Role;
		jwt: string;
		email: string;
		lang: string;
		version: string;
	}
	interface FormData {
		status: import('./domain').FormStatus;
		code: string;
	}
	// interface PageData {}
	// interface Platform {}
}
