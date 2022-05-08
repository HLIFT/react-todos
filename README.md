# 📌 Exercice Todos

## 📄 Description

Cette application permet de créer des todos avec un titre, une description, une catégorie et une date. Nous pouvons mettre comme terminée chacune des tâches ou toutes en même temps.
Nous pouvons filtrer celles-ci par date croissante, par catégorie ou par statut (À faire/en cours/terminée).
Nous pouvons aussi supprimer toutes les todos terminées.

Le front est relié au back grâce à une API qui nous permet d'enregistrer les todos en base de données, de les modifier ou de les supprimer.

## 🤖 Technos

Le front a été créé en React et le back en NodeJs.

* [Documentation React](https://fr.reactjs.org/docs/getting-started.html)
* [Documentation Node.js](https://nodejs.dev/learn)

## ⚙️ Démarrage

### 🌱 Environnement

Il faut tout d'abord créer une base de données.

Ensuite aller dans le dossier `/back` et créer le fichier `.env` :

```
cd back
cp .env.example .env
```

Modifier la variable `DATABASE_URL` de votre fichier `.env` et mettre l'url de votre base de données.
Vous pouvez préciser le port sur lequel le serveur node tournera dans la variable `SERVER_PORT`.

### 🛠 Installation des dépendances

À la racine du projet :

```
yarn install
```

### 🔋 Lancement du projet

#### Lancement du back

```
cd back
nodemon app.ts
```

Le serveur tourne sur le port que vous avez précisé dans le fichier `.env`.
Si vous n'avez pas précisé celui-ci, il tournera sur le port `4000`.

#### Lancement du front

⚠️ Si vous avez modifié le port du serveur et que celui-ci n'est plus `4000` il faut aussi le changer dans le front dans `src/helpers/api.ts` à la ligne `14`.

```
cd ..
yarn dev
```

L'application React tournera sur le port `3000`. 🎉
