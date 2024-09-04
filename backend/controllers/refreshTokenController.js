const jwt = require('jsonwebtoken');
const secretKey = "}iDm$-oJN_U:*??7)nB2Wm=<`9(2Ikp"; 


const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

    const refreshToken = cookies.refreshToken;

    // Verify the refresh token
    jwt.verify(refreshToken, secretKey, (err, decoded) => {
        if (err) return res.sendStatus(403); // Forbidden

        // Proceed to generate a new access token
        const roles = decoded.roles || []; // Assume roles are part of the decoded payload

        const accessToken = jwt.sign(
            {
                 
                    "username": decoded.username,
                    "roles": roles
                
            },
            secretKey,
            { expiresIn: '10s' } // Adjust the expiration time as needed
        );

        res.json({ roles, accessToken });
    });
};

module.exports = { handleRefreshToken };
