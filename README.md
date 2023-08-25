# JMAP Admin

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/iroco-co/jmap-admin/tree/main.svg?style=svg&circle-token=82ed4175697e4dc50e2df2f13340eaf032a50561)](https://dl.circleci.com/status-badge/redirect/gh/iroco-co/jmap-admin/tree/main)

Administration interface base on JMAP for cyrus written in svelte for:

- create, remove emails for a domain
- create, remove calendars
- create, remove addressbooks
- create, remove shared folders
- manage rights for calendars/addressbooks
- helper for DNS (clés TLS, DNS, page d'accueil HTTP)
- right management for email accounts
- quota management
- payment informations

The architecture is based on SvelteKit back and front with typescript, postgresql as backend database.

It is a work in progress.
