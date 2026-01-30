
🧱 STEP 1: Backend Project Setup (NestJS)
1️⃣ Install NestJS CLI (if not already)
npm install -g @nestjs/cli

2️⃣ Create the project
nest new doctor-app-backend
cd doctor-app-backend


Choose:
npm


🗄 STEP 2: Install Core Dependencies
Database + ORM (Prisma – recommended)
npm install prisma @prisma/client
npx prisma init

Config + Validation
npm install @nestjs/config class-validator class-transformer

Firebase Admin SDK
npm install firebase-admin

🔐 STEP 3: Firebase Authentication Setup
1️⃣ Create Firebase Project
Go to Firebase Console
Create project
Enable Authentication
Enable providers:
Email/Password
Google (optional)

2️⃣ Create Service Account
Project Settings → Service Accounts
Generate private key
Download JSON file ⚠️ DO NOT commit this file

3️⃣ Initialize Firebase Admin in NestJS
Create file:
src/firebase/firebase.service.ts

Create module:
src/firebase/firebase.module.ts

🛡 STEP 4: Auth Guard (JWT from Firebase)
src/auth/firebase-auth.guard.ts

👥 STEP 5: Database Schema (Prisma)

Edit to suit: prisma/schema.prisma
Run: npx prisma migrate dev --name init

🔁 STEP 6: Sync Firebase User → Local DB
Create:
src/users/users.service.ts


Controller:
GET /me

🧪 STEP 7: Test Auth Flow
Login from mobile/web
Get Firebase ID token

Call backend:
GET /me
Authorization: Bearer <firebase_token>

✔ User created in DB
✔ Role assigned
✔ Auth validated
