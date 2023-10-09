<script lang="ts">
	import { _, time, date } from 'svelte-i18n';
	import SvelteTable from 'svelte-table';
	import type { PageData } from './$types';
	import { Button, Color, IconMore, TextInput } from '@iroco/ui';
	import Modal from '$lib/Modal.svelte';
	import Select from 'svelte-select';
	import { Role } from '../../../domain';

	export let data: PageData;
	const rows = data.users;
	let showModal = false;
	let email = '';
	let firstName = '';
	let lastName = '';
	let password = '';
	let role: number = Role['User'];
	let password_code = data.uuid;

	let roleItems = Object.keys(Role)
		.filter((v) => isNaN(Number(v)) && !v.startsWith('Super'))
		.map((label) => ({ label, value: Role[label] }));
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
			value: (v) => v.role,
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
			key: 'lastname',
			title: 'lastname',
			value: (v) => v.lastname,
			sortable: true
		},
		{
			key: 'firstname',
			title: 'firstname',
			value: (v) => v.firstname,
			sortable: true
		}
	];
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
		{columns}
		{rows}
	/>

	<Modal bind:showModal>
		<h2 slot="header">
			{$_('account.users.modal.title')}
		</h2>

		<TextInput
			label={$_('account.users.modal.input_email')}
			bind:value={email}
			id="user_email"
			placeholder={$_('account.users.modal.input_email')}
			name="user_email"
			type="email"
		/>
		<TextInput
			label={$_('account.users.modal.input_password')}
			bind:value={password}
			id="user_password"
			placeholder={$_('account.users.modal.input_password')}
			name="user_password"
			type="password"
		/>
		<div class="iroco-ui-input">
			<label class="iroco-ui-label" for="select_role">{$_('account.users.modal.input_role')}</label>
			<Select
				items={roleItems}
				bind:role
				value="User"
				id="user_role"
				placeholder={$_('account.users.modal.select_placeholder')}
				class="account__users__roles"
				--item-hover-bg={Color.mediumGrey}
				--item-is-active-bg={Color.blue}
				--list-background={Color.darkBlue}
			/>
		</div>
		<TextInput
			label={$_('account.users.modal.input_password_code')}
			bind:value={password_code}
			id="user_password_code"
			placeholder={$_('account.users.modal.input_password_code')}
			name="user_password_code"
			type="text"
		/>
		<TextInput
			label={$_('account.users.modal.input_first_name')}
			bind:value={firstName}
			id="user_first_name"
			placeholder={$_('account.users.modal.input_first_name')}
			name="user_first_name"
			type="text"
		/>
		<TextInput
			label={$_('account.users.modal.input_last_name')}
			bind:value={lastName}
			id="user_last_name"
			placeholder={$_('account.users.modal.input_last_name')}
			name="user_last_name"
			type="text"
		/>
	</Modal>
</section>

<style lang="scss">
	@use 'node_modules/@iroco/ui/dist/scss/colors';

	:global(.account__users__roles) {
		background: colors.$darkBlue !important;
	}

	:global(.account__users__table) {
		border-collapse: collapse;
	}
	:global(.account__users__table td, th) {
		border: 1px solid colors.$darkGrey;
	}
</style>
