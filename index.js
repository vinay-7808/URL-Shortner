const express = require("express")
const URL = require("./models/url")
const connectToMongoDB = require("./connect")
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser')
const PORT = 8001


const urlRoute = require("./routes/url")
const route = require('./routes/staticRouter')
const userRoute = require('./routes/user')
const {restrictToLoggedInUserOnly,checkAuth} = require('./middleware/auth')

connectToMongoDB("mongodb://localhost:27017/shorten-url").then(console.log("Server Started"))

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use("/url",restrictToLoggedInUserOnly,urlRoute)
app.use("/user",userRoute)
app.use("/",checkAuth,route)



app.get('/url/:shortId',async (req,res)=>{
      const shortId = req.params.shortId
      const entry = await URL.findOneAndUpdate(
            {
                  shortId
            },
            {
                  $push: {
                        visitHistory: {timestamp: Date.now()}
                  }
            }
      )
      res.redirect(entry.redirectURL)
})

app.listen(PORT, () => console.log(`Server Started  at Port ${PORT}`))