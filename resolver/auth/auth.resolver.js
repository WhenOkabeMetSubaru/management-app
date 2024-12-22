const AuthCtrl = require('../../controllers/auth/auth.controller');




const resolvers = {
    Query: {
        
    },
    Mutation: {
        signin:AuthCtrl.signin
    }
}


module.exports = resolvers