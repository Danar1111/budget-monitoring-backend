const db = require('../config/db');
const cron = require('node-cron');
const crypto = require('crypto');

const generatedId = () => {
    return crypto.randomBytes(3).toString('base64');
};

exports.createNewMonthlyBudget = () => {
    cron.schedule('*/10 * * * * *', async () => { // testing setiap 10 detik 
    // cron.schedule('0 0 25 * *', async () => { // ini untuk setiap tanggap 25
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const [divisi] = await db.execute('SELECT idDivisi FROM divisi WHERE idDivisi != "ADMN"');
        const [divisiTotal] = await db.execute('SELECT COUNT(*) AS total FROM divisi WHERE idDivisi != "ADMN"');
        for (let i = 0; i < divisiTotal[0].total; i++) {
            let idIn = generatedId();
            let idOut = generatedId();
            let tableNameIn = divisi[i].idDivisi + '-' + currentMonth + '-' + currentYear + '-in' + '-' + idIn;
            let tableNameOut = divisi[i].idDivisi + '-' + currentMonth + '-' + currentYear + '-out' + '-' + idOut;
            await db.execute('INSERT INTO forecast_pemasukan (idForecastPemasukan, Bulan, Tahun, Total_Forecast_Pemasukan) VALUES (?, ?, ?, ?)', [tableNameIn, currentMonth, currentYear, 0.00]);
            await db.execute('INSERT INTO forecast_pengeluaran (idForecastPengeluaran, Bulan, Tahun, Total_Forecast_Pengeluaran) VALUES (?, ?, ?, ?)', [tableNameOut, currentMonth, currentYear, 0.00]);
        }
    });
};

exports.emailMonthlyBudget = () => {
    cron.schedule('*/10 * * * * *', async () => { // testing setiap 10 detik 
    // cron.schedule('0 0 25 * *', async () => { // ini untuk setiap tanggap 25
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const [divisi] = await db.execute('SELECT idDivisi FROM divisi WHERE idDivisi != "ADMN"');
        const [divisiTotal] = await db.execute('SELECT COUNT(*) AS total FROM divisi WHERE idDivisi != "ADMN"');
        for (let i = 0; i < divisiTotal[0].total; i++) {
            let idIn = generatedId();
            let idOut = generatedId();
            let tableNameIn = divisi[i].idDivisi + '-' + currentMonth + '-' + currentYear + '-in' + '-' + idIn;
            let tableNameOut = divisi[i].idDivisi + '-' + currentMonth + '-' + currentYear + '-out' + '-' + idOut;
            await db.execute('INSERT INTO forecast_pemasukan (idForecastPemasukan, Bulan, Tahun, Total_Forecast_Pemasukan) VALUES (?, ?, ?, ?)', [tableNameIn, currentMonth, currentYear, 0.00]);
            await db.execute('INSERT INTO forecast_pengeluaran (idForecastPengeluaran, Bulan, Tahun, Total_Forecast_Pengeluaran) VALUES (?, ?, ?, ?)', [tableNameOut, currentMonth, currentYear, 0.00]);
        }
        console.log(divisiTotal[0].total);
    });
};