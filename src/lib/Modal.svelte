<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Button } from '@iroco/ui';

	export let showModal = false;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot name="header" />
		<hr />
		<slot />
		<hr />
		<div class="button-group">
			<Button size="small" kind="success" on:click={() => dialog.close()}
				>{$_('account.users.modal.btn_save')}</Button
			>
			<Button size="small" kind="danger" on:click={() => dialog.close()}
				>{$_('account.users.modal.btn_cancel')}</Button
			>
		</div>
	</div>
</dialog>

<style lang="scss">
	@use 'node_modules/@iroco/ui/dist/scss/colors';

	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
		background: colors.$darkGrey;
		color: colors.$beige;

		&::backdrop {
			background: rgba(0.5, 0, 0, 0.3);
		}

		&[open] {
			animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		}
		> div {
			padding: 1em;
		}

		&[open]::backdrop {
			animation: fade 0.2s ease-out;
		}
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
