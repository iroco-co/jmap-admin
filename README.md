# Premier test fullstack svelte

C'est le _future_ dépôt pour l'interface d'adminstration qui permettra à un admin de : 
- créer et supprimer des emails
- créer et supprimer des calendriers
- créer et supprimer des carnets d'adresse
- créer et supprimer des dossiers partagés 
- gérer les droits pour les calendriers/carnets d'adresse
- administrer le(s) nom(s) de domaine (clés TLS, DNS, page d'accueil HTTP)
- attribuer ou supprimer des droits d'administration à d'autres adresses mail
- gérer les quotas
- suivre les paiements et factures

L'architecture sera basée sur SvelteKit en back et front en typescript, avec postgresql comme BDD backend.

Pour le moment il s'agit uniquement d'un POC svelte full stack pour voir comment ça se comporte.

Ce qui marche:
- le site en mode développement (`npm run dev`)

A creuser : 
- le build client et le build serveur et les adapters (static/node) : comment distinguer pour chaque app (cliente et serveur) les sources ?
- comment déployer le back ? 
- est-ce qu'il faut revoir le déploiement du front si on a un back node ? (pour l'instant les fronts sont générés en statique et servis par nginx)


# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
