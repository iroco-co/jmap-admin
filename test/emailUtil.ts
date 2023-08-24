import { simpleParser } from 'mailparser'
import type { ParsedMail } from 'mailparser'
import { SMTPServer } from 'smtp-server'

export function createSmtpServer(mailQueue: ParsedMail[]) {
	return new SMTPServer({
		onData(stream, session, callback) {
			simpleParser(stream, {}, (err, parsed) => {
				mailQueue.push(parsed)
				return callback(null)
			})
		},
		disabledCommands: ['AUTH'],
		hideSTARTTLS: true
	})
}
