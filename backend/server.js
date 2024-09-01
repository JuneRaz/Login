const express = require('express');
const app = express();
const path = require('path');
var db = require('./config/dbconnections');
const corsOptions = require('./config/corseOption');
const cors = require('cors');
const bcrypt = require('bcrypt');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const { logger } = require('./middleware/logEvents');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');



app.use(logger);
app.use(credentials);

app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
//app.use('/logout', require('./routes/logout'));

app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));


app.use(verifyJWT);

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
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

  



app.listen(7000, ()=>{
    console.log("Listening...");
})