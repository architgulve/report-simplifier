
import * as SQLite from 'expo-sqlite';

// ✅ Open database with modern API
const db = SQLite.openDatabaseSync('cura.db');
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';


// ✅ Create the settings table
export const initDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        language TEXT NOT NULL,
        bloodgroup TEXT NOT NULL,
        emergencyContact TEXT NOT NULL,
        primaryDoctor TEXT NOT NULL
      );
    `);
    console.log('✅ Settings table created successfully');
  } catch (error) {
    console.error('❌ Error creating settings table:', error);
  }
};

// ✅ Insert into settings
export const insertSetting = async (name, language, bloodgroup, emergencyContact, primaryDoctor) => {
  try {
    const result = await db.runAsync(
      `INSERT OR REPLACE INTO settings (name, language, bloodgroup, emergencyContact, primaryDoctor) VALUES (?, ?, ?, ?, ?);`,
      [name, language, bloodgroup, emergencyContact, primaryDoctor]
    );
    console.log('✅ Setting inserted:', result);
    return true;
  } catch (error) {
    console.error('❌ Error inserting setting:', error);
    return false;
  }
};

// ✅ Get settings
export const getSettings = async () => {
  try {
    const result = await db.getFirstAsync(`SELECT * FROM settings LIMIT 1;`);
    return result || null;
  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    return null;
  }
};

// ✅ Clear settings (optional)
export const clearSettings = async () => {
  try {
    await db.runAsync(`DELETE FROM settings;`);
    console.log('✅ Settings cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing settings:', error);
    return false;
  }
};

// ✅ Create diet table
export const dietpage = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS diet (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        calories INTEGER NOT NULL,
        protein INTEGER NOT NULL,
        water INTEGER NOT NULL,
        breakfast TEXT NOT NULL,
        lunch TEXT NOT NULL,
        dinner TEXT NOT NULL,
        description TEXT NOT NULL
      );
    `);
    console.log('✅ Diet table created successfully');
  } catch (error) {
    console.error('❌ Error creating diet table:', error);
  }
};

// ✅ Insert into diet table
export const insertDiet = async (calories, protein, water, breakfast, lunch, dinner, description) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO diet (calories, protein, water, breakfast, lunch, dinner, description) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [calories, protein, water, breakfast, lunch, dinner, description]
    );
    console.log('✅ Diet inserted:', result);
    return true;
  } catch (error) {
    console.error('❌ Error inserting diet:', error);
    return false;
  }
};

// ✅ Get latest diet record
export const getLatestDiet = async () => {
  try {
    const result = await db.getFirstAsync(`SELECT * FROM diet ORDER BY id DESC LIMIT 1;`);
    return result || null;
  } catch (error) {
    console.error('❌ Error fetching diet:', error);
    return null;
  }
};

// ✅ Get all diet records
export const getAllDiets = async () => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM diet ORDER BY id DESC;`);
    return result || [];
  } catch (error) {
    console.error('❌ Error fetching diets:', error);
    return [];
  }
};

// ✅ Initialize all tables
export const initializeDatabase = () => {
  initDatabase();
  dietpage();
};


