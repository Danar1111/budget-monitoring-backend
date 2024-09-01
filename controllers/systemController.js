const db = require('../config/db');
// const cron = require('node-cron');
const crypto = require('crypto');
// const nodemailer = require('nodemailer');

function generateRandomString(length) {
    return crypto
        .randomBytes(length)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, length);
}

// exports.createNewMonthlyBudget = () => {
//     // cron.schedule('*/10 * * * * *', async () => { // testing setiap 10 detik 
//     cron.schedule('0 0 25 * *', async () => { // ini untuk setiap tanggal 25
//         const currentDate = new Date();
//         let currentMonth = currentDate.getMonth() + 1;
//         let currentYear = currentDate.getFullYear();
//         currentMonth++;
//         if (currentMonth > 12) {
//             currentMonth =  1;
//             currentYear++;
//         }
        
//         const [divisi] = await db.execute('SELECT idDivisi FROM divisi WHERE idDivisi != "ADMN"');
//         const [divisiTotal] = await db.execute('SELECT COUNT(*) AS total FROM divisi WHERE idDivisi != "ADMN"');
//         for (let i = 0; i < divisiTotal[0].total; i++) {
//             let idIn = generateRandomString();
//             let idOut = generateRandomString();
//             let tableNameIn = divisi[i].idDivisi + '-' + currentMonth + '-' + currentYear + '-in' + '-' + idIn;
//             let tableNameOut = divisi[i].idDivisi + '-' + currentMonth + '-' + currentYear + '-out' + '-' + idOut;
//             await db.execute('INSERT INTO forecast_pemasukan (idForecastPemasukan, Bulan, Tahun, Total_Forecast_Pemasukan) VALUES (?, ?, ?, ?)', [tableNameIn, currentMonth, currentYear, 0.00]);
//             await db.execute('INSERT INTO forecast_pengeluaran (idForecastPengeluaran, Bulan, Tahun, Total_Forecast_Pengeluaran) VALUES (?, ?, ?, ?)', [tableNameOut, currentMonth, currentYear, 0.00]);
//         }
//         console.log(`create forecast for month ${currentMonth} and year ${currentYear} successfull`);
//     });
// };

// exports.createNewMonthlyBudgetActual = () => {
//     // cron.schedule('*/10 * * * * *', async () => { // testing setiap 10 detik 
//     cron.schedule('0 0 1 * *', async () => { // ini untuk setiap tanggal 25
//         const currentDate = new Date();
//         const currentMonth = currentDate.getMonth() + 1;
//         const currentYear = currentDate.getFullYear();
        
//         const [divisi] = await db.execute('SELECT idDivisi FROM divisi WHERE idDivisi != "ADMN"');
//         const [divisiTotal] = await db.execute('SELECT COUNT(*) AS total FROM divisi WHERE idDivisi != "ADMN"');
//         for (let i = 0; i < divisiTotal[0].total; i++) {
//             let idIn = generateRandomString();
//             let idOut = generateRandomString();
//             let tableNameIn = divisi[i].idDivisi + '-' + currentMonth + '-' + currentYear + '-actualIn' + '-' + idIn;
//             let tableNameOut = divisi[i].idDivisi + '-' + currentMonth + '-' + currentYear + '-actualOut' + '-' + idOut;
//             await db.execute('INSERT INTO actual_pemasukan (idActualPemasukan, Bulan, Tahun, Total_Actual_Pemasukan) VALUES (?, ?, ?, ?)', [tableNameIn, currentMonth, currentYear, 0.00]);
//             await db.execute('INSERT INTO actual_pengeluaran (idActualPengeluaran, Bulan, Tahun, Total_Actual_Pengeluaran) VALUES (?, ?, ?, ?)', [tableNameOut, currentMonth, currentYear, 0.00]);
//         }
//         console.log(`create actual value for month ${currentMonth} and year ${currentYear} successfull`);
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

//         try {
//             const [spv] = await db.execute('SELECT Nama, Email FROM users WHERE Role = "supervisor"');

//             // const optionalEmail = ({Nama: 'dafarel', Email:'dacukucay@gmail.com'}); // untuk testing, masukkan email yang ingin menerima pesan
//             // spv.push(optionalEmail);

//             // console.log(spv);

//             for (let i = 0; i < spv.length; i++) {
//                 const sendMail = async () => {
//                     try {
//                         const info = await transporter.sendMail({
//                             from: process.env.EMAIL_FROM,
//                             to: spv[i].Email,
//                             subject: `Hello ${spv[i].Nama}, Reminder for forecast submission`,
//                             text: `Dear ${spv[i].Nama},\n\nThis is a reminder to submit your monthly forecast.\n\nBest regards,\nYour Team`,
//                             // html: `<p>Dear ${spv[i].Nama},</p><p>This is a reminder to submit your monthly forecast.</p><p>Best regards,<br>Your Team</p>` // Jika menggunakan format HTML
//                         });
                        
//                         console.log(`Email sent to ${spv[i].Nama}:`, info.response);
//                     } catch (error) {
//                         console.error(`Error sending email to ${spv[i].Nama}:`, error);
//                     }
//                 };
                
//                 await sendMail();
//             }
//         } catch (err) {
//             console.error('Error fetching supervisors from database:', err);
//         }
//     });
// };

// exports.emailReminder = () => {
//     cron.schedule('*/10 * * * * *', async () => { // testing setiap 10 detik 
//     // cron.schedule('0 0 1 * *', async () => { // ini untuk setiap tanggal 25
//         const transporter = nodemailer.createTransport({
//             host: process.env.EMAIL_HOST,
//             port: 465,
//             secure: true,
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASSWORD
//             }
//         });

//         try {
//             const [divisi] = await db.execute('SELECT idDivisi FROM divisi WHERE idDivisi != "ADMN"');
//             const divisiUnsubmit = new Array;
//             for (let i = 0; i < divisi.length; i++) {
//                 const [unsubmitIn] = await db.execute('SELECT * FROM forecast_pemasukan WHERE idUser IS NULL AND idForecastPemasukan LIKE ?', [`${divisi[i].idDivisi}%`]);
//                 if (unsubmitIn.length > 0) {
//                     divisiUnsubmit.push(divisi[i].idDivisi);
//                 }
//             }
//             console.log(divisiUnsubmit);
            
//             const spv = new Array;
//             for (let j = 0; j < divisiUnsubmit.length; j++) {
//                 const [temp] = await db.execute('SELECT Nama, Email FROM users WHERE Role = "supervisor" AND idDivisi = ?',[divisiUnsubmit[j]]);
//                 if (temp.length > 0) {
//                     spv.push(temp[0]);
//                 }
//             }
//             console.log(spv);
            

//             // const optionalEmail = ({Nama: 'dafarel', Email:'dacukucay@gmail.com'}); // untuk testing, masukkan email yang ingin menerima pesan
//             // spv.push(optionalEmail);

//             // console.log(spv);

//             // for (let i = 0; i < spv.length; i++) {
//             //     const sendMail = async () => {
//             //         try {
//             //             const info = await transporter.sendMail({
//             //                 from: process.env.EMAIL_FROM,
//             //                 to: spv[i].Email,
//             //                 subject: `Hello ${spv[i].Nama}, Quickly submit a forecast!`,
//             //                 text: `Dear ${spv[i].Nama},\n\nThis is a reminder that you have not submitted your monthly forecast until today.\n\nBest regards,\nYour Team`,
//             //                 // html: `<p>Dear ${spv[i].Nama},</p><p>This is a reminder that you have not submitted your monthly forecast until today.</p><p>Best regards,<br>Your Team</p>` // Jika menggunakan format HTML
//             //             });
                        
//             //             console.log(`Email sent to ${spv[i].Nama}:`, info.response);
//             //         } catch (error) {
//             //             console.error(`Error sending email to ${spv[i].Nama}:`, error);
//             //         }
//             //     };
                
//             //     // await sendMail();
//             // }
//         } catch (err) {
//             console.error('Error fetching supervisors from database:', err);
//         }
//     });
// };