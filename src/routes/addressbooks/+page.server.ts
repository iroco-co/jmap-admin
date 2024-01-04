import type { PageServerLoad } from './$types';
import { getAddressBooks } from '$lib/jmap';
import { FormStatus } from '../../domain';

export const load: PageServerLoad = async (event) => {
	try {
		const jmapResponse = await getAddressBooks(event.locals.jwt);
		return {
			email: event.locals.email,
			role: event.locals.role,
			jmapStatus: FormStatus.OK,
			addressbooks: jmapResponse.list
		};
	} catch (e) {
		return {
			email: event.locals.email,
			role: event.locals.role,
			jmapStatus: FormStatus.Error,
			key: 'err.jmap_error',
			message: (<Error>e).message,
			addressbooks: []
		};
	}
};
