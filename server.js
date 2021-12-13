require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser') 
const corsConfig = require('./cors/corsConfig') ;
const path = require('path')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsConfig))
app.use(fileUpload({
    useTempFiles: true
}))


app.use('/user',require('./routes/userRouter'))
app.use('/api',require('./routes/categoryRouter'))
app.use('/api',require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/workerRouter'))
app.use('/api', require('./routes/paymentRouter'))
app.use('/api',require('./routes/catworkRouter'))
app.use('/api',require('./routes/bannerRouter')) 
app.use('/api',require('./routes/PushNotification'))



const URI = 'mongodb+srv://athaana:1234@cluster0.4rzb2.mongodb.net/TestAthaana?retryWrites=true&w=majority'
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err =>{
    if(err) throw err;
    console.log('Connected to MongoDB')
})

const buildPath = path.normalize(path.join(__dirname, './client/build'));
app.use(express.static(buildPath));

app.get('(/*)?', async (req, res, next) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(buildPath, "./sw.js"));
});
 






const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log('Server is running on port', PORT)
})