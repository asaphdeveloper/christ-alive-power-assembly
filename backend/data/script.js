import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { connectDatabase } from '../config/database.js';
import Admin from '../models/admin.model.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await connectDatabase();

const admins = JSON.parse(
  await fs.readFile(`${__dirname}/admins.json`, 'utf-8'),
);

const importAdmins = async () => {
  try {
    await Admin.deleteMany();
    await Admin.insertMany(admins);


    console.log('Admins Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const deleteAdmins = async () => {
  try {
    await Admin.deleteMany();

    console.log('Admins Data Deleted!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-i-a') {
  importAdmins();
} else if (process.argv[2] === '-d-a') {
  deleteAdmins();
}
