const {getUser} = require('../service/auth')
function restrictToLoggedInUserOnly(req,res,next){
      const useruid = req.cookies?.uid
      if(!useruid) return res.redirect('/login')
      const user = getUser(useruid)
      if(!user) return res.redirect('/login')
      req.user = user
      next()
}
function checkAuth(req,res,next){
      const useruid = req.cookies?.uid
      
      const user = getUser(useruid)
      
      req.user = user
      next()
}
module.exports = {restrictToLoggedInUserOnly,checkAuth}