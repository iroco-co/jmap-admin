import { intersection } from 'lodash-es'

const specialChars = '~`!@#$%^&*()_+-=|}{][":.,?><;_&/\''

export function checkPassword(password: string | null): string | null {
  if (password === null) {
    return null
  } else if (password.length < 8) {
    return 'signup.errors.pass_less_than_8'
  } else if (!/[A-Z]/.test(password)) {
    return 'signup.errors.pass_has_uppercase_letter'
  } else if (!/[a-z]/.test(password)) {
    return 'signup.errors.pass_has_lowercase_letter'
  } else if (!/\d/.test(password)) {
    return 'signup.errors.pass_has_number'
  } else if (intersection([...specialChars], [...password]).length === 0) {
    return 'signup.errors.pass_has_special_char'
  } else {
    return null
  }
}

export function checkUsername(_username: string, email: string): string | null {
  if (_username === '') {
    return 'signup.errors.empty_username'
  } else if (_username != null && !isEmailValid(email)) {
    return 'signup.errors.invalid_username'
  } else {
    return null
  }
}

export function isEmailValid(email: string): boolean {
  // see https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
  // eslint-disable-next-line no-control-regex
  return /^(?:[a-z0-9!#$%&'*/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
    email
  )
}