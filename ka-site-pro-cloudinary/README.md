# Site vitrine KA — Vercel + Cloudinary

Site professionnel pour KA : terrasse bois, dalle sur plot et aménagements extérieurs.

## Fonctionnement des photos automatiques

Le site lit automatiquement les images Cloudinary via `/api/gallery`.

Deux méthodes possibles :

### Méthode recommandée : dossier Cloudinary
1. Crée un dossier Cloudinary nommé : `ka-realisations`
2. Ajoute tes photos dedans.
3. Le site affichera automatiquement les images du dossier.

### Catégorisation automatique
Le site classe les photos selon le nom du fichier ou les tags :
- `bois` ou `terrasse-bois` → Terrasse bois
- `dalle` ou `plot` → Dalle sur plot
- `piscine` → Contour piscine
- `avant`, `apres`, `before`, `after` → Avant / Après

Exemples de noms propres :
- `ka-realisations/terrasse-bois-villa-lyon-01`
- `ka-realisations/dalle-sur-plot-piscine-01`
- `ka-realisations/avant-apres-terrasse-01`

## Variables d'environnement à mettre sur Vercel

Dans Vercel > Project > Settings > Environment Variables :

```env
CLOUDINARY_CLOUD_NAME=ton_cloud_name
CLOUDINARY_API_KEY=ta_api_key
CLOUDINARY_API_SECRET=ton_api_secret
CLOUDINARY_FOLDER=ka-realisations
CLOUDINARY_TAG=
```

## Lancer en local

```bash
npm install
npm run dev
```

La galerie Cloudinary fonctionne surtout en production Vercel, car elle utilise `/api/gallery`.

## Déployer sur Vercel

### Option simple via GitHub
1. Dézippe ce dossier.
2. Crée un dépôt GitHub.
3. Envoie tous les fichiers sur GitHub.
4. Va sur Vercel > Add New > Project.
5. Importe ton dépôt.
6. Vercel détecte Vite.
7. Vérifie :
   - Build Command : `npm run build`
   - Output Directory : `dist`
8. Ajoute les variables Cloudinary.
9. Clique Deploy.

### Option en ligne de commande

```bash
npm install
npm run build
npm i -g vercel
vercel --prod
```

## Contact configuré

- Téléphone : 06 13 54 14 47
- Téléphone 2 : 06 19 28 40 55
- Email : kaya42dalle@gmail.com
- Zone : Lyon et alentours
- SIRET : 895 342 665 00018
