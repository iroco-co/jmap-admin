<script lang="ts">
  import { _ } from 'svelte-i18n'
  import { Button, RadioButton, TextInput } from '@iroco/ui'
  import Logo from '../../lib/Logo.svelte'
  import { isEmpty } from 'lodash-es'
  import { enhance } from '$app/forms'
  import { checkPassword, checkUsername } from '$lib/validation'
  import { FormStatus } from '../../domain.js'

  let emailExtension = '@iroco.co'
  let username = null
  let password = null
  let repeatPassword = ''
  let email = ''
  let buttonDisabled: boolean
  let emailAvailable: boolean
  let usernameValidationPromise: Promise<string> = new Promise(() => '')
  let repeatPasswordFocused = false
  let checkPasswordKey: string | null
  let termsChecked = false
  export let form: FormData

  export let delay = function (fn: (emailParameter: string) => void, ms: number): (args) => void {
    let timer
    return function (emailParameter) {
      clearTimeout(timer)
      timer = setTimeout(fn.bind(this, emailParameter), ms || 0)
    }
  }

  $: email = (username === null ? '' : username) + emailExtension
  $: checkPasswordKey = checkPassword(password)
  $: checkUsernameKey = checkUsername(username, email)
  $: buttonDisabled =
    checkUsername(username, email) != null ||
    !emailAvailable ||
    isEmpty(password) ||
    password !== repeatPassword ||
    !termsChecked
</script>

<section class="signup">
  <div class="signup__header">
    <Logo margin={1} />
    <h1>{$_('signup.title')}</h1>
    <a href="/" class="signup__header__subtitle">{$_('signup.already_have_account')}</a>
  </div>

  <form class="signup__form iroco-ui-form" method="POST" use:enhance>
    <input type="hidden" name="email" value={email} />
    <section class="signup__form__extension">
      <span class="iroco-ui-label">{$_('signup.choice')}</span>
      <div class="signup__form__extension__group two-columns">
        <div class="signup__form__extension__group__item">
          <RadioButton bind:group={emailExtension} value="@iroco.co">
            <span>iroco.co</span>
          </RadioButton>
        </div>
        <div class="signup__form__extension__group__item">
          <RadioButton bind:group={emailExtension} value="@iroco.io">
            <span>iroco.io</span>
          </RadioButton>
        </div>
      </div>
    </section>

    <span class="iroco-ui-label">{$_('signup.email')}</span>
    <section class="signup__form__username two-columns">
      <div>
        <TextInput
          bind:value={username}
          id="username"
          placeholder={$_('signup.username')}
          htmlError={true}
          error={checkUsernameKey === null ? null : $_(checkUsernameKey)}
        />
        {#await usernameValidationPromise then error_message}
          <p class="error">
            {error_message}
          </p>
        {/await}
      </div>
      <div>
        <TextInput
          bind:value={emailExtension}
          id="emailExtension"
          placeholder={emailExtension}
          readonly={true}
        />
      </div>
    </section>

    <section class="signup__form__password two-columns">
      <div>
        <TextInput
          label={$_('signup.password')}
          bind:value={password}
          id="password"
          placeholder={$_('signup.password')}
          name="password"
          type="password"
          error={checkPasswordKey == null ? null : $_(checkPasswordKey)}
        />
      </div>
      <div>
        <TextInput
          label={$_('signup.repeat_password')}
          bind:value={repeatPassword}
          id="repeat_password"
          type="password"
          error={repeatPasswordFocused && password !== repeatPassword
						? $_('signup.errors.not_the_same_password')
						: null}
          placeholder={$_('signup.repeat_password')}
          onFocus={() => (repeatPasswordFocused = true)}
          onBlur={() => (repeatPasswordFocused = false)}
        />
      </div>
    </section>

    {#if form?.status === FormStatus.Error}
      <p class="error">{$_('signup.errors.server')}: {$_(form.code)}</p>
    {/if}

    <div class="signup__form__terms">
      <input
        type="checkbox"
        id="terms"
        name="terms"
        data-testid="terms"
        bind:checked={termsChecked}
      />
      <label for="terms">{$_('signup.terms.title')}</label>
      <a target="_blank" href="https://iroco.co/terms" rel="noopener noreferrer"
      >{$_('signup.terms.link')}</a
      >
    </div>
    <Button type="submit" kind="success" disabled={buttonDisabled}>{$_('signup.submit')}</Button>
  </form>
</section>

<style lang="scss">
  @use 'node_modules/@iroco/ui/scss/colors';
  @use 'node_modules/@iroco/ui/scss/containers';

  :global {
    .iroco-ui-button {
      width: 100%;
    }

    .icon-info {
      align-self: center;
    }
  }

  .signup {
    @include containers.container-medium();
    background: colors.$nightBlue;
    border-radius: 1em;
    padding: 4em;
    margin-top: 4em;

    .two-columns {
      display: flex;
      gap: 1em;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;

      div {
        flex: 1;
      }
    }

    @media only screen and (max-width: containers.$break-point-tablet) {
      .two-columns {
        flex-direction: column;
      }
    }

    &__header {
      text-align: center;
      padding-bottom: 5em;
    }

    &__form {
      section {
        padding-bottom: 1em;
      }

      &__extension {
        &__group {
          &__item {
            background-color: colors.$darkBlue;
            padding: 1em;
            border-radius: 0.5em;
          }
        }
      }

      &__email {
        text-align: center;
        font-size: larger;
      }

      &__subscription {
        display: flex;
        flex-direction: column;
        &__peruse {
          display: inline-flex;
        }
        &__fixed {
          &__price {
            font-weight: bold;
            font-size: medium;
          }
        }
      }

      &__terms {
        padding-top: 1em;
        text-align: center;
      }
    }
  }
</style>
