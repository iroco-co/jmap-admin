import type { RequestEvent } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'

export function POST(request: RequestEvent) {
	request.cookies.delete('Authorization', { path: '/' })
	throw redirect(302, '/')
}
