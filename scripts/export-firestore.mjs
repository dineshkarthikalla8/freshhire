import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Load config from standard firebase setup or env
const firebaseConfig = {
  apiKey: "dummy",
  projectId: "freshhire-2026",
  databaseURL: "https://freshhire-2026.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function exportCollection(collectionName, outputPath) {
  console.log(`Exporting ${collectionName}...`);
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`Successfully exported ${data.length} documents to ${outputPath}`);
  } catch (error) {
    console.error(`Error exporting ${collectionName}:`, error);
  }
}

async function main() {
  await exportCollection('studyContent', path.join(process.cwd(), 'src/data/bundledStudyContent.json'));
  await exportCollection('companyExams', path.join(process.cwd(), 'src/data/bundledExams.json'));
  process.exit(0);
}

main();
