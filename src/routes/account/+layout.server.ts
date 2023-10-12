import { repository } from '$lib/server/db'
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async (event) => {
    return { user: await repository.getUser(event.locals.email), version: event.locals.version }
}
