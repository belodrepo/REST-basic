//REST backend
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('test.db', (err) => {
if (err) {
    console.log(err.message);
} else {
    console.log('Az adatbázis kapcsolat létrejött.');
}
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    gender TEXT NOT NULL
)`);

app.post('/api/users', (req, res) => {
    const { firstName, lastName, city, address, phone, email, gender } = req.body;

    db.run(`INSERT INTO users (firstName, lastName, city, address, phone, email, gender) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [firstName, lastName, city, address, phone, email, gender], 
        function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Hiba történt az adatbok rögzítése során!' });
            } else {
                return res.status(201).send({ message: 'Az adatok rögzítése sikeres volt.', id: this.lastID, firstName, lastName, address, phone, email, gender });
            }
        });

});

app.get('/api/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, records) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Hiba történt az adatok kiolvasása során' });
        } 
        res.status(200).json(records);
        
    });
});

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM users WHERE id = ?`, [id], 
        function (err) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
                res.status(204).json( { message: 'Sikeres adattörlés!' });
            }

        });
});


app.listen(port, () => {
    console.log(`A szerver fut a ${port} számú porton`);
})