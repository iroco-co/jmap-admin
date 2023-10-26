import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/svelte';
import { screen } from '@testing-library/dom';
import index from '../../../src/routes/account/calendars/+page.svelte';

import { addMessages, init } from 'svelte-i18n';

import en from '../../../src/lib/i18n/en.json';

addMessages('en', en);
init({ fallbackLocale: 'en', initialLocale: 'en' });
describe('Calendars page', () => {
	test('render page', async () => {
		render(index, {
			data: {
				calendars: [{ id: 'cal_id', name: 'cal_name' }]
			}
		});
		screen.getByText('Calendars');
		screen.getByText('cal_id');
		screen.getByText('cal_name');
	});
});
