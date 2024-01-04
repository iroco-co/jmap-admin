# JMAP Admin

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/iroco-co/jmap-admin/tree/main.svg?style=svg&circle-token=82ed4175697e4dc50e2df2f13340eaf032a50561)](https://dl.circleci.com/status-badge/redirect/gh/iroco-co/jmap-admin/tree/main)

[JMAP](https://jmap.io/) administration front written in svelte for:

- create, remove calendars
- create, remove addressbooks
- create, remove shared folders
- manage rights for calendars/addressbooks/folders
- quota management

The architecture is based on SvelteKit back and front with typescript, JMAP server as backend.

The goal is to make a graphical interface for what [cyradm](https://www.cyrusimap.org/imap/reference/manpages/systemcommands/cyradm.html) is providing as command line interface.

It is a work in progress.

## Authenticating

The app is stateless, the user should come with a [Json Web Token](https://jwt.io/) in a `Authorization` cookie. The JWT will be used to send [JMAP queries](https://jmap.io/) to the backend. For [Cyrus](https://www.cyrusimap.org/3.6/imap/reference/manpages/configs/imapd.conf.html) the header has to contain the fields,

```json
{
	"typ": "JWT",
	"alg": "HS512"
}
```

The payload should have the following structure:

```json
{
	"role": 3,
	"sub": "user@domain.co",
	"iat": 1704359437,
	"iss": "urn:iroco:issuer",
	"exp": 1704361242
}
```

The role is corresponding to the typescript enum. It should be `ADMIN(3)` else a `403 Unauthorized` will be thrown:

```typescript
enum Role {
	Temporary,
	Trial,
	User,
	Admin,
	SuperAdmin
}
```

A secret should be provided to the app with an environment variable `JWT_SECRET` to check the signature of the token. For more details on accessing the app see [hooks.server.ts](src/hooks.server.ts). For authenticating to the backend, the same secret should be shared with the JMAP or IMAP server (for Cyrus see the `http_jwt_key_dir` section in [imapd.conf](https://www.cyrusimap.org/3.6/imap/reference/manpages/configs/imapd.conf.html)).

## Develop

Installing dépendencies

```shell
npm i
```

Run tests

```shell
npm run test
```

Run dev server

```shell
npm run dev
```

Releasing: the docker is built and pushed by the CI. We use release-it for creating a TAG.
We use the [semantic versioning](https://semver.org/).

```shell
npm run release
```
