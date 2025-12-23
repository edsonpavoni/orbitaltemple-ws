# Get Firebase Configuration

You need to get your Firebase web app configuration to complete the setup.

## Steps:

1. Go to https://console.firebase.google.com/project/orbital-temple

2. Click the gear icon (⚙️) next to "Project Overview" → "Project settings"

3. Scroll down to "Your apps" section

4. If you don't have a web app yet:
   - Click "</>" (Web icon) to add a web app
   - Give it a name: "Satellite Visualization"
   - Click "Register app"

5. You'll see the Firebase configuration object:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "orbital-temple.firebaseapp.com",
     databaseURL: "https://orbital-temple-default-rtdb.firebaseio.com",
     projectId: "orbital-temple",
     storageBucket: "orbital-temple.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

6. Copy this entire object

7. Then run this command to update the satellite page:
   ```bash
   # I'll help you update it once you have the config
   ```

## Also Enable Realtime Database

1. In Firebase Console, click "Realtime Database" in the left menu

2. Click "Create Database"

3. Choose your location (e.g., "us-central1")

4. Start in "test mode" (we'll deploy proper rules)

5. Click "Enable"
