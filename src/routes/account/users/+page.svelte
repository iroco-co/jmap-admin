<script lang="ts">
	import { _, time, date } from 'svelte-i18n';
	import SvelteTable from 'svelte-table';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { Button, Color, IconMore, TextInput, TextInputType } from '@iroco/ui';
	import Modal from '$lib/Modal.svelte';
	import Select from 'svelte-select';
	import { Role } from '../../../domain';
	import { invalidate } from '$app/navigation';

	export let data: PageData;
	let showModal = false;
	let password_code = data.uuid;
	let role: string = 'User';
	let closeModal: () => void;

	let roles = Object.keys(Role).filter((v) => isNaN(Number(v)) && !v.startsWith('Super'));
	const columns = [
		{
			key: 'email',
			title: 'email',
			value: (v) => v.email,
			sortable: true
		},
		{
			key: 'role',
			title: 'role',
			value: (v) => Role[v.role],
			sortable: true
		},
		{
			key: 'creation_date',
			title: 'creation_date',
			value: (v) => `${$date(v.creation_date, { format: 'medium' })}
                    ${$time(v.creation_date, { format: 'medium' })}`,
			sortable: true
		},
		{
			key: 'firstname',
			title: 'firstname',
			value: (v) => v.firstname,
			sortable: true
		},
		{
			key: 'lastname',
			title: 'lastname',
			value: (v) => v.lastname,
			sortable: true
		}
	];
	async function saveUser() {
		closeModal();
		await invalidate('user:create');
		return true;
	}
</script>

<section class="account__users">
	<h1>{$_('account.users.title')}</h1>
	<Button size="small" kind="success" id="create-user-button" on:click={() => (showModal = true)}>
		<IconMore width="15px" height="15px" />
	</Button>
	<SvelteTable
		classNameTable="account__users__table"
		classNameThead="table-primary"
		classNameCell={['account__users__table__cell']}
		rows={data.users}
		{columns}
	/>

	<Modal bind:showModal bind:closeModal>
		<h2 slot="header">
			{$_('account.users.modal.title')}
		</h2>

		<form method="POST" class="iroco-ui-form" autocomplete="off" use:enhance>
			<TextInput
				label={$_('account.users.modal.input_email')}
				id="user_email"
				placeholder={$_('account.users.modal.input_email')}
				name="user_email"
				type="email"
				autocomplete="new-password"
			/>
			<TextInput
				label={$_('account.users.modal.input_password')}
				id="user_password"
				placeholder={$_('account.users.modal.input_password')}
				name="user_password"
				type="password"
				autocomplete="new-password"
			/>
			<div class="iroco-ui-input">
				<label class="iroco-ui-label" for="select_role"
					>{$_('account.users.modal.input_role')}</label
				>
				<Select
					items={roles}
					id="user_role"
					bind:role
					value="User"
					placeholder={$_('account.users.modal.select_placeholder')}
					class="account__users__roles"
					--item-hover-bg={Color.mediumGrey}
					--item-is-active-bg={Color.blue}
					--list-background={Color.darkBlue}
				/>
				<input type="hidden" name="user_role" value={role} />
			</div>
			<TextInput
				label={$_('account.users.modal.input_password_code')}
				id="user_password_code"
				bind:value={password_code}
				placeholder={$_('account.users.modal.input_password_code')}
				name="user_password_code"
				type="text"
			/>
			<TextInput
				label={$_('account.users.modal.input_first_name')}
				id="user_first_name"
				placeholder={$_('account.users.modal.input_first_name')}
				name="user_first_name"
				type={TextInputType.text}
			/>
			<TextInput
				label={$_('account.users.modal.input_last_name')}
				id="user_last_name"
				placeholder={$_('account.users.modal.input_last_name')}
				name="user_last_name"
				type={TextInputType.text}
			/>
			<hr />
			<div class="button-group">
				<Button type="submit" size="small" kind="success" on:click={saveUser}>
					{$_('account.users.modal.btn_save')}
				</Button>
				<Button size="small" kind="danger" on:click={closeModal}
					>{$_('account.users.modal.btn_cancel')}</Button
				>
			</div>
		</form>
	</Modal>
</section>

<style lang="scss">
	@use 'node_modules/@iroco/ui/dist/scss/colors';
	:global(.account__users__roles) {
		background: colors.$darkBlue !important;
	}
	:global(.account__users__table) {
		border-collapse: collapse;
		max-width: 90%;
	}
	:global(.account__users__table td, th) {
		border: 1px solid colors.$darkGrey;
		padding: 0 1em 0 1em;
	}
</style>
