const express=require('express')
const cors=require('cors')
const app=express()
const bodyParser = require("body-parser");

app.use(express.static(__dirname + '/'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

const connectDB=require('./config/connectDB')

//middleware
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb", parameterLimit: 50000 }));
app.use(cors())
app.use(express.static(__dirname + '/'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

//connectDB (config)
connectDB()


//routes
app.use("/course",require('./routes/course'))
app.use("/utilisateur",require('./routes/utilisateur'))
app.use("/administrateur",require('./routes/administrateur'))

//run server
const port=process.env.PORT||5000
app.listen(port,err=>err?console.log(err):console.log(`connected on port ${port}`))
