import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Load environment variables from .env.local
config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function seed() {
  console.log('Initializing Firebase...');

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log('Creating test document in "sites" collection...');

  await setDoc(doc(db, 'sites', 'test-site'), {
    name: 'Test Plumbing',
    subdomain: 'test',
  });

  console.log('Document created successfully!');
  console.log('Database connection verified.');

  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
