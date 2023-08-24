import { isEmpty } from 'lodash-es'
import type { GenericObject } from '../domain'

export function humanSize(size: number, sizesStr: string): string {
	const sizes = sizesStr.split(' ')
	let i = 0
	while (size >= 1024) {
		size /= 1024
		++i
	}
	return `${size.toFixed()} ${sizes[i]}`
}

export function createTemplate(template: string) {
	return (obj: GenericObject) => {
		return Object.keys(obj).reduce((acc, key) => acc.replaceAll(`$\{${key}}`, obj[key]), template)
	}
}

export function lastChars(nb: number, string: string): string {
	return isEmpty(string) ? '(no value)' : `(ends with ...${string.slice(-nb)})`
}

export function getLanguageFromHeader(headerValue: string): string {
	return headerValue.split('-')[0]
}
