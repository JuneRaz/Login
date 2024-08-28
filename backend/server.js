const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = '123123123123asdasdkljqwheihasjkdhkdjfhiuhq983e12heijhaskjdkasbd812hyeijahsdkb182h3jaksd';

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, HTTP authentication, etc.)
};
app.use(express.json());
app.use(cors(corsOptions));
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud"

})

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const sql = "SELECT * FROM login WHERE username = ?";

    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results.length > 0) {
            const user = results[0];
            const roles = user.role ? [user.role] : []; // Extract roles from the database, assuming a single role per user

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Bcrypt error:', err);
                    return res.status(500).json({ message: "Internal Server Error" });
                }

                if (isMatch) {
                    const firstTimeLogin = !user.password_changed;

                    // Update password_changed to true after the first login
                    if (firstTimeLogin) {
                        const updateSql = "UPDATE login SET password_changed = TRUE WHERE username = ?";
                        db.query(updateSql, [email], (updateErr) => {
                            if (updateErr) {
                                console.error('Update error:', updateErr);
                                return res.status(500).json({ message: "Internal Server Error" });
                            }
                        });
                    }

                    const accessToken = jwt.sign({ email: user.username, roles: roles }, secretKey, { expiresIn: '1h' });

                    return res.status(200).json({ roles, accessToken, firstTimeLogin });
                } else {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    });
});



app.post('/reset', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Bcrypt error:', err);
            return res.status(500).json({ message: 'Error resetting password' });
        }

        const sql = 'UPDATE login SET password = ? WHERE username = ?';
        db.query(sql, [hashedPassword, email], (err, result) => {
            if (err) {
                console.error('Error resetting password:', err);
                return res.status(500).json({ message: 'Error resetting password' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            return res.status(200).json({ message: 'Password reset successfully' });
        });
    });
});

  



app.listen(7000, ()=>{
    console.log("Listening...");
})