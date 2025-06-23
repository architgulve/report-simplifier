import SQLite from 'react-native-sqlite-storage';
const db = SQLite.openDatabase(
  { name: 'MedicineDatabase.db', location: 'default' },
  () => { console.log('Database opened'); },
  error => { console.log('Error: ', error); }
);
db.transaction(tx => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS Medicine (
      MedicineID INTEGER PRIMARY KEY AUTOINCREMENT,
      MedicineName TEXT NOT NULL,
      QuantityLiquid INTEGER DEFAULT 0,
      QuantityTablet INTEGER DEFAULT 0,
      NumberOfDays INTEGER NOT NULL,
      TimeToBeTakenAt TEXT NOT NULL,
      StartDate DATE NOT NULL
    );`
  );
});
const insertMedicine = (name, quantityLiquid, quantityTablet, numberOfDays, timeToBeTakenAt, startDate) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO Medicine (MedicineName, QuantityLiquid, QuantityTablet, NumberOfDays, TimeToBeTakenAt, StartDate)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, quantityLiquid, quantityTablet, numberOfDays, timeToBeTakenAt, startDate],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('Medicine inserted successfully');
        } else {
          console.log('Insertion failed');
        }
      }
    );
  });
};
const getAllMedicines = () => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM Medicine', [], (tx, results) => {
      let medicines = [];
      for (let i = 0; i < results.rows.length; i++) {
        medicines.push(results.rows.item(i));
      }
      console.log(medicines);
    });
  });
};

export { insertMedicine, getAllMedicines };
