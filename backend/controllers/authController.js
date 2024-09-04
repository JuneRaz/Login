const bcrypt = require('bcrypt');
var db = require('../config/dbconnections');
const jwt = require('jsonwebtoken');

const secretKey = '123123123123asdasdkljqwheihasjkdhkdjfhiuhq983e12heijhaskjdkasbd812hyeijahsdkb182h3jaksd';
const refreshSecretKey = '}iDm$-oJN_U:*??7)nB2Wm=<`9(2Ikp'; // Replace with your actual secret key for refresh tokens

const handleLogin = async (req, res) => {
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

                    // Create Access Token with 10 seconds expiration
                    const accessToken = jwt.sign(
                        { email: user.username, roles: roles },
                        secretKey,
                        { expiresIn: '10s' }
                    );

                    // Create Refresh Token with 1 day expiration
                    const refreshToken = jwt.sign(
                        { email: user.username, roles: roles },
                        refreshSecretKey,
                        { expiresIn: '10s' }
                    );

                    // Set the Access Token as a cookie
                    res.cookie('jwt', accessToken, {
                        httpOnly: true,   // Accessible only by the web server
                        secure: true,     // Use HTTPS
                        sameSite: 'None', // Cross-site cookie
                        maxAge: 10 * 1000 // 10 seconds
                    });

                    // Set the Refresh Token as a cookie
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None',
                        maxAge: 10 * 1000 // 1 day
                    });

                    if (firstTimeLogin) {
                        const updateSql = "UPDATE login SET password_changed = TRUE WHERE username = ?";
                        db.query(updateSql, [email], (updateErr) => {
                            if (updateErr) {
                                console.error('Update error:', updateErr);
                                return res.status(500).json({ message: "Internal Server Error" });
                            }
                            return res.status(200).json({ roles, accessToken, firstTimeLogin });
                        });
                    } else {
                        return res.status(200).json({ roles, accessToken, firstTimeLogin });
                    }
                } else {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    });
};

module.exports = { handleLogin };
