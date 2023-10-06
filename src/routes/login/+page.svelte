<script lang="ts">
	import { Button, TextInput } from '@iroco/ui';
	import { _ } from 'svelte-i18n';
	import { enhance } from '$app/forms';
	import Logo from '$lib/Logo.svelte';
	import { FormStatus } from '../../domain.js';
	import type PageData from '@sveltejs/kit';
	export let form: FormData;
	export let data: PageData;
</script>

<main class="login container-medium">
	<section class="login__section">
		<Logo />
		<form method="POST" class="iroco-ui-form" use:enhance>
			{#if data?.redirect_url !== undefined && data.redirect_url !== null}
				<input type="hidden" name="redirect_url" value={data.redirect_url} />
			{/if}
			<TextInput placeholder={$_('login.email')} type="email" name="email" />
			<TextInput placeholder={$_('login.password')} name="password" type="password" />
			{#if form?.status === FormStatus.Error}<p class="error">{$_(form?.code)}</p>{/if}
			<Button type="submit" kind="success">{$_('login.connection')}</Button>
		</form>
		<a class="login__footer" href="/password">{$_('login.lost_password')}</a>
	</section>
</main>

<style lang="scss">
	@use 'node_modules/@iroco/ui/dist/scss/colors';
	:global(.iroco-ui-input) {
		margin-bottom: 1em;
	}
	.login {
		display: flex;
		justify-content: center;
		min-height: 100vh;

		&__section {
			display: flex;
			flex-direction: column;
			align-items: center;
			border-radius: 1em;
			background: colors.$nightBlue;
			margin: auto;
			padding: 2em;

			:global(.iroco-ui-button) {
				width: 100%;
			}

			&__footer {
				font-size: small;
			}
		}
	}
</style>
