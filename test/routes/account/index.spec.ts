import '@testing-library/jest-dom/extend-expect'
import { render, waitFor } from '@testing-library/svelte'
import { screen } from '@testing-library/dom'
import index from '../../../src/routes/account/+page.svelte'

import { addMessages, init } from 'svelte-i18n'

import en from '../../../src/lib/i18n/en.json'
import { Role } from '../../../src/domain'
import { DateTime } from 'luxon'

addMessages('en', en)
init({ fallbackLocale: 'en', initialLocale: 'en' })
describe('Account information', () => {
	test('render page', async () => {
		render(index, {
			data: {
				user: { email: 'foo@bar.com', firstname: 'Foo', lastname: 'Bar', role: Role.User },
				quota: { id: 'mail', used: 50, total: 200 }
			}
		})
		screen.getByText('Welcome')

		await waitFor(() => expect(screen.getByText('Foo')).toBeInTheDocument())
		screen.getByText('Bar')
		screen.getByText('foo@bar.com')
		screen.getByText('50 B/200 B (25%)')
	})

	test('display number of trial days left', async () => {
		render(index, {
			data: {
				user: {
					email: 'foo@bar.com',
					firstname: 'Foo',
					lastname: 'Bar',
					role: Role.Trial,
					creation_date: DateTime.now().minus({ days: 3 }).toJSDate()
				},
				quota: { id: 'mail', used: 50, total: 200 }
			}
		})
		await waitFor(() =>
			expect(screen.queryByText('You have 27 trial days left.')).toBeInTheDocument()
		)
	})

	test('do not display number of trial days left for regular user', async () => {
		render(index, {
			data: {
				user: {
					email: 'foo@bar.com',
					firstname: 'Foo',
					lastname: 'Bar',
					role: Role.User,
					creation_date: DateTime.now().minus({ days: 6 }).toJSDate()
				},
				quota: { id: 'mail', used: 50, total: 200 }
			}
		})
		await waitFor(() => expect(screen.queryByText('You have 27 trial days left.')).toBeNull())
	})

	test('display an alert if user has not confirmed the email', async () => {
		render(index, {
			data: {
				user: {
					email: 'foo@bar.com',
					firstname: 'Foo',
					lastname: 'Bar',
					role: Role.Temporary,
					creation_date: DateTime.now().minus({ days: 6 }).toJSDate()
				},
				quota: { id: 'mail', used: 50, total: 200 }
			}
		})
		await waitFor(() =>
			expect(screen.queryByText('Warning: your account is not yet activated')).toBeInTheDocument()
		)
	})
})
