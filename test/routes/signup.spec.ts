import { fireEvent, render } from '@testing-library/svelte';
import { screen } from '@testing-library/dom';
import signup from '../../src/routes/signup/+page.svelte';
import { addMessages, init } from 'svelte-i18n';

import fr from '../../src/lib/i18n/fr.json';

addMessages('fr', fr);
init({ fallbackLocale: 'fr', initialLocale: 'fr' })

describe('Signup form', () => {
	test('render signup page', () => {
		const { container } = render(signup)

		screen.getByText('Création de compte')
		screen.getByText('Vous avez déjà un compte ?')
		screen.getByText('Choisissez votre nom de domaine')
		screen.getByText('Choisissez votre adresse mail')
		screen.getByPlaceholderText("Nom d'utilisateur")
		screen.getByText('Choisissez votre mot de passe')
		screen.getByPlaceholderText('Choisissez votre mot de passe')
		screen.getByText('Confirmez votre mot de passe')
		screen.getByPlaceholderText('Confirmez votre mot de passe')
		screen.getByText('Créer le compte')

		expect(screen.getByText('Créer le compte')).toBeDisabled()
		expect(container.querySelectorAll('.error')).toHaveLength(0)
	})

	test('username accepts lower case letters and numbers', async () => {
		const { container } = render(signup)

		await fireEvent.input(screen.getByPlaceholderText("Nom d'utilisateur"), {
			target: { value: 'hypia1' }
		})

		expect(container.querySelector('.error')).toBe(null)
	})

	test('domain name accepts lower case letters dot extension', async () => {
		const { container } = render(signup)

		await fireEvent.input(screen.getByPlaceholderText("Choisissez votre nom de domaine"), {
			target: { value: 'domain.com' }
		})

		expect(container.querySelector('.error')).toBe(null)
	})

	test('invalid domain name', async () => {
		const { container, getByPlaceholderText } = render(signup)

		await fireEvent.input(getByPlaceholderText("Choisissez votre nom de domaine"), {
			target: { value: 'domain' }
		})
		expect(container.querySelectorAll('.error')).toHaveLength(2)
		screen.getByText('Le nom de domaine est de la forme domaine.extension')
	})

	test('invalid username', async () => {
		const { container, getByPlaceholderText } = render(signup)

		await fireEvent.input(getByPlaceholderText("Nom d'utilisateur"), {
			target: { value: '.JohnDoe.' }
		})
		expect(container.querySelectorAll('.error')).toHaveLength(2)
		// expect(container.querySelectorAll('a')[1].href).toEqual('https://iroco.co/offers#emailsyntax')
	})

	test('password and repeat_password are different', async () => {
		render(signup)
		const password = screen.getByPlaceholderText('Choisissez votre mot de passe')
		const repeat_password = screen.getByPlaceholderText('Confirmez votre mot de passe')

		await fireEvent.input(password, { target: { value: 'Password' } })
		await fireEvent.input(repeat_password, { target: { value: 'monPassword' } })
		await fireEvent.focus(repeat_password)

		screen.getByText('Les deux mots de passe ne correspondent pas')
	})

	test('should show created email', async () => {
		render(signup)
		await fill_form("foo", "bar.com")
		screen.getByText("foo@bar.com")
	})
})

describe('Checking Password Validity', () => {
	test('password needs to be at least 8 chars', async () => {
		render(signup)
		const password = screen.getByPlaceholderText('Choisissez votre mot de passe')

		await fireEvent.input(password, { target: { value: 'mdp' } })

		screen.getByText('Votre mot de passe doit faire au moins 8 caractères.')
	})
	test('password needs to be at least one capital letter', async () => {
		render(signup)
		const password = screen.getByPlaceholderText('Choisissez votre mot de passe')

		await fireEvent.input(password, { target: { value: 'password' } })

		screen.getByText('Votre mot de passe doit contenir au moins une majuscule.')
	})
	test('password needs to be at least one lowercase letter ', async () => {
		render(signup)
		const password = screen.getByPlaceholderText('Choisissez votre mot de passe')

		await fireEvent.input(password, { target: { value: 'PASSWORD' } })

		screen.getByText('Votre mot de passe doit contenir au moins une minuscule.')
	})
	test('password needs to be at least one number ', async () => {
		render(signup)
		const password = screen.getByPlaceholderText('Choisissez votre mot de passe')

		await fireEvent.input(password, { target: { value: 'passworD' } })

		screen.getByText('Votre mot de passe doit contenir au moins un chiffre.')
	})
	test('password needs to have at least one special character ', async () => {
		render(signup)
		const password = screen.getByPlaceholderText('Choisissez votre mot de passe')

		await fireEvent.input(password, { target: { value: 'pa5sWord' } })

		screen.getByText('Votre mot de passe doit contenir au moins un caractère spécial.')
	})
})

async function fill_form(userName = "hypia",domainName = "foo.com") {
	await fireEvent.input(screen.getByPlaceholderText("Choisissez votre nom de domaine"), {
		target: { value: domainName }
	})
	await fireEvent.input(screen.getByPlaceholderText("Nom d'utilisateur"), {
		target: { value: userName }
	})
	await fireEvent.input(screen.getByPlaceholderText('Choisissez votre mot de passe'), {
		target: { value: 'myPass' }
	})
	await fireEvent.input(screen.getByPlaceholderText('Confirmez votre mot de passe'), {
		target: { value: 'myPass' }
	})
	await fireEvent.click(screen.getByTestId('terms'))
}