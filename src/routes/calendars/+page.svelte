<script lang="ts">
	import { Button, IconMore, IconTrashCan } from '@iroco/ui';
	import { _ } from 'svelte-i18n';
	import type { PageData } from './$types';

	export let data: PageData;
	function handleDeleteCalendar() {}
</script>

<section>
	<h1>{$_('account.calendars.title')}</h1>
	<table class="data-table">
		<thead class="data-table__header">
			<tr>
				<th class="data-table__header__cell">
					{$_('account.calendars.id')}
					<Button size="small" kind="success" id="create-alias-button">
						<IconMore width="15px" height="15px" />
					</Button>
				</th>
				<th class="data-table__header__cell">
					{$_('account.calendars.name')}
				</th>
				<th class="data-table__header__cell" />
			</tr>
		</thead>

		<tbody class="data-table__body">
			{#each data.calendars as calendar}
				<tr class="data-table__body__row">
					<td class="data-table__body__cell">
						{calendar.id}
					</td>
					<td class="data-table__body__cell">
						{calendar.name}
					</td>

					<td class="data-table__body__cell">
						<Button size="small" kind="danger" on:click={() => handleDeleteCalendar()}>
							<IconTrashCan stroke={'white'} width="20px" height="20px" />
						</Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<style lang="scss">
	@use '../../../node_modules/@iroco/ui/dist/scss/colors';
	.data-table {
		table-layout: fixed;
		width: 90%;
		border: 1px solid colors.$mediumGrey;
		border-radius: 0.5em;
		background: colors.$darkBlue;
		&__header {
			font-size: 1.5em;
			height: 2.5em;
			text-align: left;

			&__cell {
				border-bottom: 1px solid colors.$mediumGrey;
				padding-left: 1em;
				button {
					margin-left: 1em;
				}
			}
		}
		&__body {
			&__cell {
				vertical-align: middle;
				padding: 0 1em;
			}
		}
	}

	@media all and (min-width: 768px) {
		.data-table {
			&__body {
				&__cell {
					&--interactive {
						display: flex;
						align-items: center;
						span {
							padding: 0 1em;
						}
					}
				}
			}
		}
	}
</style>
