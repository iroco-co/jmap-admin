import pino from 'pino'
import { PUBLIC_LOG_LEVEL } from '$env/static/public'

export const logger = pino({
	name: 'iroco-app',
	level: PUBLIC_LOG_LEVEL ?? 'info',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: false
		}
	}
})
