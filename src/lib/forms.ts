import type { GenericObject } from '../domain';

export function createForm(data: GenericObject) {
	const form = new FormData();
	for (const field in data) {
		form.append(field, data[field]);
	}
	return form;
}
