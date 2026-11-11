import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { connectDatabase } from '../config/database.js';
import User from '../models/user.model.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await connectDatabase();

const users = JSON.parse(
  await fs.readFile(`${__dirname}/users.json`, 'utf-8'),
);

const importAll = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(users);

    console.log('All Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const deleteAll = async () => {
  try {
    await User.deleteMany();

    console.log('All Deleted!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const importUsers = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(users);


    console.log('Users Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const deleteUsers = async () => {
  try {
    await User.deleteMany();

    console.log('Users Data Deleted!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-i-u') {
  importUsers();
} else if (process.argv[2] === '-d-u') {
  deleteUsers();
} else if (process.argv[2] === '-i-a') {
  importAll();
} else if (process.argv[2] === '-d-a') {
  deleteAll();
}
