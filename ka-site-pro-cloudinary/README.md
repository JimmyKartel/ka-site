# Site vitrine Kaya Ahmet

Application HTML5 React/Vite hébergée sur Vercel, avec galerie Cloudinary automatique.

## Architecture

- `src/main.jsx` : application React, navigation, hero, services, galerie, contact email et sections SEO locales.
- `src/styles.css` : design responsive mobile-first, charte noir/orange/blanc inspiree des visuels KA.
- `api/gallery.js` : fonction Vercel qui lit les images Cloudinary du dossier `ka-realisations`, applique les transformations et renvoie toutes les photos paginées.
- `index.html` : métadonnées SEO, Open Graph et données structurées LocalBusiness.
- `vercel.json` : configuration Vite et cache de l'API galerie.

## Variables d'environnement Vercel

Dans Vercel > Project > Settings > Environment Variables :

```env
CLOUDINARY_CLOUD_NAME=ton_cloud_name
CLOUDINARY_API_KEY=ta_api_key
CLOUDINARY_API_SECRET=ton_api_secret
CLOUDINARY_FOLDER=ka-realisations
CLOUDINARY_TAG=
CLOUDINARY_MAX_ASSETS=500
```

`CLOUDINARY_TAG` est optionnel. Si la variable est vide, le site utilise le dossier `ka-realisations`.

## Galerie Cloudinary

Le site affiche toutes les images trouvées dans `ka-realisations`, jusqu'à `CLOUDINARY_MAX_ASSETS`.

La categorie est detectee avec le nom du fichier ou les tags :

- `bois`, `wood`, `terrasse-bois` -> Terrasse bois
- `dalle`, `plot`, `slab` -> Dalle sur plot
- `terrassement`, `terrain` -> Terrassement
- `piscine`, `pool` -> Contour piscine
- `avant`, `apres`, `before`, `after` -> Avant / Apres

## Contact

Le formulaire valide les champs puis prépare un email vers `kaya42dalle@gmail.com` avec `mailto:`.

Pour un vrai envoi serveur sans ouvrir le client mail de l'utilisateur, il faut ajouter un fournisseur email transactionnel comme Resend, SendGrid ou SMTP.

## Lancement local

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Déploiement Vercel

- Build Command : `npm run build`
- Output Directory : `dist`
- Framework : Vite

Le déploiement GitHub -> Vercel redéploie automatiquement la home après push sur la branche configurée.
