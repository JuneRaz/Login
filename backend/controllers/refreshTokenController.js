const jwt = require('jsonwebtoken');
const db = require('../config/dbconnections'); // Your MySQL database connection
const secretKey = process.env.SECRET_KEY; // Use environment variable for secret key

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized if no token is found
    const refreshToken = cookies.jwt;

    try {
        // Query the database to find the user with the provided refresh token
        const query = 'SELECT * FROM users WHERE refreshToken = ?';
        db.query(query, [refreshToken], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.sendStatus(500); // Internal Server Error
            }
            
            if (results.length === 0) return res.sendStatus(403); // Forbidden if no user found
            
            const foundUser = results[0];
            jwt.verify(refreshToken, secretKey, (err, decoded) => {
                if (err || foundUser.username !== decoded.username) return res.sendStatus(403); // Forbidden if verification fails

                const roles = foundUser.roles ? foundUser.roles.split(',') : []; // Assuming roles are stored as a comma-separated string
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "username": decoded.username,
                            "roles": roles
                        }
                    },
                    secretKey,
                    { expiresIn: '15m' } // Adjust the expiry time as needed
                );

                res.json({ roles, accessToken });
            });
        });
    } catch (error) {
        console.error('Error handling refresh token:', error);
        res.sendStatus(500); // Internal Server Error for any unexpected errors
    }
};

module.exports = { handleRefreshToken };
