const User = require('../models/user-model')
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

class userController {
    static googleSign(req, res) {
       
        async function verify() {
            const ticket = await client.verifyIdToken({
                
                idToken: req.body.token,
                audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
           
            let token = sign(userid, process.env.JWT_SECRET)
            
            res.status(200).json(token)
            // If request specified a G Suite domain:
            //const domain = payload['hd'];
          }
          verify().catch(error => {
              res.status(500).json(error)
          });
    }

    static register(req, res) {
        const { email, password } = req.body
        User
            .create({
                email,
                password
            })
            .then((createdUser) => {
                res.status(200).json({ message: 'Successfully created a user!', createdUser })
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    static login(req, res) {
        const { email, password } = req.body
        User
            .findOne({
                email
            })
            .then((findOneUser) => {
                if (!findOneUser) res.status(401).json({ message: 'Email/Password is incorrect!' })
                else if (!compare(password, findOneUser.password)) res.status(401).json({ message: 'Email/Password is incorrect!' })
                else {
                    const { id, first_name, last_name, email } = findOneUser
                    const payload = { id, email }
                    const token = sign(payload)
                    req.headers.token = token
                    res.status(200).json({
                        message: 'You have successfully logged in!',
                        token,
                        details: payload
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json(err)
            })
    }
}

module.exports = userController