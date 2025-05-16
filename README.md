
# NutriTrack

NutriTrack is a nutrition tracking web application built with React, Vite, Firebase, and Tailwind CSS. It allows users to log meals, track daily nutrition, and manage personal nutrition goals.

## Features

- User authentication (Firebase)
- Meal logging and nutrition tracking
- Set and update daily nutrition goals
- View meal logs by date
- Responsive UI with dark mode support
- Persistent data storage (Firebase Firestore)
- Toast notifications for user feedback

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)  
- npm or bun  

### Installation
### 1. Clone the repository:
   ```sh
   git clone https://github.com/Akhil3517/Demo.git
   cd nutrition-tracker-main
```

### 2. Install dependencies:

```sh
npm install
# or
bun install
```
### 3.Set up your Firebase project:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).

2. Enable **Authentication** and **Firestore Database** in your Firebase project.

3. Copy your Firebase configuration object from the Firebase Console.

4. Create a `.env` file in your project root (if it doesn’t exist).

5. Add the following environment variables to your `.env` file, replacing the placeholders with your actual Firebase config values:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here

## Technologies Used

- React  
- Vite  
- Node.js  
- Express  
- Firebase  
- Tailwind CSS  
- date-fns

## Deployment

The app is deployed and accessible at:

[Live Link](https://nutrition-tracker-five.vercel.app/)



