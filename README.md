
# TutorConnect

TutorConnect est une plateforme de tutorat en ligne permettant aux tuteurs de créer des classes virtuelles payantes et d’interagir efficacement avec leurs étudiants via visioconférence, messagerie et dépôt de devoirs.

## Structure du projet

```
TutorConnect/
├── TutorConnect-app/ (Backend - Jakarta EE)
├── tutorconnectfrontend/ (Frontend - React)
```

## Prérequis

- **Java 17**
- **Maven 3.8+**
- **Node.js 16+** (pour le frontend React)
- **MySQL 8**

## Installation Backend (TutorConnect-app)

```bash
git clone https://github.com/Zouhair-gh/TutorConnect-app.git
cd TutorConnect/TutorConnect-app
```

1️⃣ Créez la base de données `tutor_connect` sous MySQL :  
```sql
CREATE DATABASE tutor_connect;
```

2️⃣ Configurez `src/main/resources/application.properties`  


```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tutor_connect
spring.datasource.username=root
spring.datasource.password=mot_de_passe
```

3️⃣ Build et exécutez le backend :  
```bash
mvn clean install
mvn spring-boot:run
```

- **API accessible** : http://localhost:8080/api

## Installation Frontend (tutorconnectfrontend)

```bash
cd TutorConnect/tutorconnectfrontend
npm install
npm start
```

- **Frontend accessible** : http://localhost:3000

## Lancer les tests (Backend)

```bash
mvn test
```
