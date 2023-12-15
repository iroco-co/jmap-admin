import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/svelte';
import { screen } from '@testing-library/dom';
import index from '../../../src/routes/addressbooks/+page.svelte';

import { addMessages, init } from 'svelte-i18n';

import en from '../../../src/lib/i18n/en.json';

addMessages('en', en);
init({ fallbackLocale: 'en', initialLocale: 'en' });
describe('Address books page', () => {
	test('render page', async () => {
		render(index, {
			data: {
				addressbooks: [{ id: 'addr_id', name: 'addr_name' }]
			}
		});
		screen.getByText('Address books');
		screen.getByText('addr_id');
		screen.getByText('addr_name');
	});
});
