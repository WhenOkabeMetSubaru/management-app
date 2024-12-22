const config = require('../config/config');
const jwt = require('jsonwebtoken')
module.exports = (req) => {

    try {
       

        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            
      
            const token = req.headers.authorization.split(' ')[1]
          
            const decodedToken = jwt.verify(
                token,
                config.jwtSecret
                
            )
            

    
            
            
            const authData = {
                type: decodedToken.user_type,
                user_id: decodedToken._id
            }
            return authData


        }

    } catch (err) {
        const authData = {
            user_id: null,
            type: ''
        }
        return authData
    }

}