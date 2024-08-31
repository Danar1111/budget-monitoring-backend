const db = require('../config/db');
// const cron = require('node-cron');
const crypto = require('crypto');
// const nodemailer = require('nodemailer');

const generatedId = () => {
    return crypto.randomBytes(3).toString('base64');
};

function generateRandomString(length) {
    return crypto
        .randomBytes(length)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '') // Remove non-URL-safe characters
        .substring(0, length); // Ensure the string is of the desired length
}

// exports.createNewMonthlyBudget = () => {
//     // cron.schedule('*/10 * * * * *', async () => { // testing setiap 10 detik 
//     cron.schedule('0 0 25 * *', async () => { // ini untuk setiap tanggal 25
//         const currentDate = new Date();
//         const currentMonth = currentDate.getMonth() + 1;
//         const currentYear = currentDate.getFullYear();
        
//         const [divisi] = await db.execute('SELECT idDivisi FROM divisi WHERE idDivisi != "ADMN"');
//         const [divisiTotal] = await db.execute('SELECT COUNT(*) AS total FROM divisi WHERE idDivisi != "ADMN"');
//         for (let i = 0; i < divisiTotal[0].total; i++) {
//             let idIn = generatedId();
//             let idOut = generatedId();
//             let tableNameIn = divisi[i].idDivisi + '-' + currentMonth + '-' + currentYear + '-in' + '-' + idIn;
//             let tableNameOut = divisi[i].idDivisi + '-' + currentMonth + '-' + currentYear + '-out' + '-' + idOut;
//             await db.execute('INSERT INTO forecast_pemasukan (idForecastPemasukan, Bulan, Tahun, Total_Forecast_Pemasukan) VALUES (?, ?, ?, ?)', [tableNameIn, currentMonth, currentYear, 0.00]);
//             await db.execute('INSERT INTO forecast_pengeluaran (idForecastPengeluaran, Bulan, Tahun, Total_Forecast_Pengeluaran) VALUES (?, ?, ?, ?)', [tableNameOut, currentMonth, currentYear, 0.00]);
//         }
//     });
// };

// exports.emailMonthlyBudget = () => {
//     // cron.schedule('*/10 * * * * *', async () => { // testing setiap 10 detik 
//     cron.schedule('0 0 25 * *', async () => { // ini untuk setiap tanggal 25
//         const transporter = nodemailer.createTransport({
//             host: process.env.EMAIL_HOST,
//             port: 465,
//             secure: true,
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASSWORD
//             }
//         });        

//         const emailArray = [
//             'priyambodo02@gmail.com',
//             'dacukucay@gmail.com'
//         ];
//         const sendMail = async () => {
//             try {
//                 const info = await transporter.sendMail({
//                     from: process.env.EMAIL_FROM,
//                     to: emailArray.join(', '), // Gabungkan alamat email dengan koma
//                     subject: 'Percobaan',
//                     text: 'ini pesan yang dikirim',
//                     // html: '<b>Body of the email in HTML format</b>' // Jika Anda ingin mengirim email dalam format HTML
//                 });
        
//                 console.log('Email sent:', info.response);
//             } catch (error) {
//                 console.error('Error sending email:', error);
//             }
//         };
        
//         sendMail();
//     });
// };