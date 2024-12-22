const {gql} = require('apollo-server-express');


const typeDefs = gql`

     type Query{

            getAllUsers:AllUserDataOutput
     }


    type Mutation {

        signin(email:String,password:String):LoginSignUpOutput
    }
    

    type LoginSignUpOutput {
        error:Boolean
        message:String
        token:String
        data:UserData
    }


`

module.exports  = typeDefs;