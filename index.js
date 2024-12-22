const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const auth = require('./auth/auth')
const connectToMongo = require('./db');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const cors = require('cors');
// const helmet = require('helmet');
const http = require('http');
const multer = require('multer');
const path = require('path');
const { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled } = require('apollo-server-core');
// const UserRoutes = require('./routes/userRoutes');
// const AuthRoutes = require('./routes/authRoutes');
// const CourseRoutes = require('./routes/courseRoutes');
connectToMongo();


const app = express();

const PORT = process.env.PORT ||  5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(compress());
app.use(express.static('uploads'));
// app.use(helmet())





app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*') 
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
        
    )
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    
   
    next()
})
app.use(cors())



const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,+ Date.now()+file.originalname )
    }
})

const upload = multer({storage:storage});

app.post('/uploads/multiple',upload.array('testimages'),(req,res)=>{
    let fileData =req.files?.map((data)=>{
        return `http://localhost:5000/${data.filename}`
    })

    return res.json({
        data:fileData
    })
});

app.post('/uploads/single',upload.single('testimage'),(req,res)=>{
    return res.json({
        url:`http://localhost:5000/${req.file.filename}`
    })
})
const  graphqlUploadExpress  = require('graphql-upload/graphqlUploadExpress.js');
app.use(graphqlUploadExpress())

app.get('/', (req, res) => {
    res.redirect('/graphql');
})


const schema = require('./schema');



const server = new ApolloServer({
    schema,
    context:({req})=>{
        let user = auth(req);
        return user
    },
    
    introspection:true,
    // plugins:[ApolloServerPluginLandingPageGraphQLPlayground()]
    plugins:[ApolloServerPluginLandingPageDisabled()]

})
const setServer = async () => {
   
    await server.start();

    server.applyMiddleware({ app })
    
}
setServer();

const httpServer = http.createServer(app);
// server.installSubscriptionHandlers(httpServer)


httpServer.listen(PORT, () => {
    console.log(`Server working at http://localhost:${PORT}${server.graphqlPath}`)
   
})




