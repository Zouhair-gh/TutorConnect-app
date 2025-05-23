# TutorConnect 🚀

TutorConnect est une plateforme de tutorat en ligne permettant aux tuteurs de créer des classes virtuelles payantes et d’interagir efficacement avec leurs étudiants via visioconférence, messagerie et dépôt de devoirs.

## Structure du projet

```
TutorConnect/
├── TutorConnect-app/ (Backend - Spring Boot)
├── tutorconnectfrontend/ (Frontend - React)
```

## 📌 Table des Matières
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
  - [Avec Docker](#avec-docker-recommandé)
  - [Manuelle](#installation-manuelle)
- [Déploiement](#-déploiement-docker)
- [Tests](#-suite-de-tests)
- [Contribuer](#-guide-de-contribution)
- [Support](#-support--contact)

## ✨ Fonctionnalités

### 🎓 Pour les Tuteurs
- 🎥 **Visioconférence** avec Jitsi Meet (HD, partage d'écran, enregistrement)
- 📅 **Gestion de planning** intelligent avec rappels
- 📊 **Tableau de bord** analytique (statistiques d'engagement)
- 📝 **Système de devoirs** avec correction automatique/manuelle
- 💰 **Gestion des paiements** intégrée

### 🧑‍🎓 Pour les Étudiants
- 🏠 **Espace personnel** avec suivi de progression détaillé
- 📚 **Bibliothèque de ressources** partagées
- ✉️ **Messagerie sécurisée** (texte, fichiers, code)
- 🔔 **Système de notification** (email, in-app)
- ⏱ **Historique des sessions** avec replay

### ⚙️ Fonctionnalités Techniques
- 🔐 **Auth JWT** avec refresh tokens
- 🌐 **API RESTful** documentée (Swagger)
- 📦 **Dockerisé** (multi-stage builds)
- 📈 **Monitoring** (Prometheus, Grafana)
- ✅ **Test CI/CD** (GitHub Actions)

## 🏗 Architecture Technique

![image](https://github.com/user-attachments/assets/eadeffd6-8985-45c9-a967-3431935a0ae7)

## Contenerisation

# 1. Cloner le dépôt
git clone https://github.com/Zouhair-gh/TutorConnect.git
cd TutorConnect

# 2. Configurer les variables d'environnement
cp .env.example .env
nano .env  # Éditer selon votre configuration

# 3. Démarrer les services
docker-compose -f docker-compose.prod.yml up --build -d

# 4. Accéder à l'application
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
# Swagger: http://localhost:8080/swagger-ui.html


# 1. Configurer la base de données
mysql -u root -p
CREATE DATABASE tutorconnect;
CREATE USER 'tutoradmin'@'localhost' IDENTIFIED BY 'securepassword';
GRANT ALL PRIVILEGES ON tutorconnect.* TO 'tutoradmin'@'localhost';
FLUSH PRIVILEGES;

# 2. Configurer application.properties
nano src/main/resources/application.properties

# 3. Builder et lancer
mvn clean package
java -jar target/tutorconnect-1.0.0.jar

## FRONT END 

npm install
npm run build
serve -s build -p 3000


## BACK END 

# Tests unitaires
mvn test

# Tests d'intégration
mvn verify

# Couverture de code
mvn jacoco:report

# Contact 
MAROUANE MORAD
Zouhair-gh
Amine Maaroufi


