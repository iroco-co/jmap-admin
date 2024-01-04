import type { PageServerLoad } from './$types';
import { getCalendars } from '$lib/jmap';
import { FormStatus } from '../../domain';

export const load: PageServerLoad = async (event) => {
	try {
		const jmapResponse = await getCalendars(event.locals.jwt);
		return {
			email: event.locals.email,
			role: event.locals.role,
			jmapStatus: FormStatus.OK,
			calendars: jmapResponse.list
		};
	} catch (e) {
		return {
			email: event.locals.email,
			role: event.locals.role,
			jmapStatus: FormStatus.Error,
			key: 'err.jmap_error',
			message: (<Error>e).message,
			calendars: []
		};
	}
};
