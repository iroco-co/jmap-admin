import { SMTPServer } from 'smtp-server';
import { simpleParser as parser } from 'mailparser';
import pino from 'pino';

const logger = pino({
	name: 'iroco-app',
	level: 'info'
});

const server = new SMTPServer({
	onData(stream, session, callback) {
		parser(stream, {}, (err, parsed) => {
			if (err) logger.error('Error:', err);
			logger.info(parsed);
			return callback(null);
		});
	},
	disabledCommands: ['AUTH'],
	hideSTARTTLS: true
});

server.listen(25, 'localhost');
