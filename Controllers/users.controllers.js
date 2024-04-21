const db = require('../models/index.js');
const User = db.User;
const bcrypt=require("bcrypt")

//             register 


const register= async (request, response) => {
    const {username,email, password} = request.body
      console.log(email)
    const hashedPassword = await bcrypt.hash(password, 10)
  
    const getUserQuery = await User.findOne({ where: { email: request.body.email } });
  console.log("get user query  "+getUserQuery)
    const dbUser =getUserQuery

    console.log("user email "+dbUser)
  
    if (dbUser !== null) {
      response.status(400)
      response.send('User already exists')
    } else {
      if (password.length < 6) {
        response.status(400)
        response.send('Password is too short')
      } else {
        const info={
            username:username,
            email:email,
            password:hashedPassword
        }
        console.log("info information  "+info)
        const createUserQuery =await User.create(info)
  
        await db.createUserQuery
        response.send('User created successfully')
      }
    }
  }


//       login


const loginUser=  async (request, response) => {
    const {email, password} = request.body
    const payload = {email}
  
    const getUserQuery =  await User.findOne({where:{email:email}});
  console.log("getsssss   "+getUserQuery)
    const dbUser = getUserQuery.password
    console.log(dbUser)
    const pass=dbUser.password
    console.log("passwords  "+pass)
  
    if (dbUser === undefined) {
      response.status(400)
      response.send('Invalid user')
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
      if (isPasswordMatched) {
        const jwtToken = jwt.sign(payload, 'itsBalajiPassword')
        response.send({jwtToken})
      } else {
        response.status(400)
        response.send('Invalid password')
      }
    }
  }

 
 
  //       Authorization

  const authenticateToken = (request, response, next) => {
    const authToken = request.headers['authorization']
    let jwtToken
    if (authToken !== undefined) {
      jwtToken = authToken.split(' ')[1]
    }
    if (jwtToken === undefined) {
      response.status(401)
      response.send('Invalid JWT Token')
    } else {
      jwt.verify(jwtToken, 'itsBalajiPassword', async (error, payload) => {
        if (error) {
          response.status(401)
          response.send('Invalid JWT Token')
        } else {
          const getUser = await User.findOne({where:{email:payload.email}})
             const getUserId=getUser.id;
          const dbUser = await db.get(getUserId)
          request.userId = dbUser.userId
          next()
        }
      })
    }
  }
  
  

module.exports = {
    register,loginUser
};
