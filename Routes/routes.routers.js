
const userControllers=require('../Controllers/users.controllers.js');

const router=require("express").Router();

// router.post('/addproduct',productControllers.addProduct);

// router.get('/allproduct',productControllers.getAllProducts);

router.post('/register/',userControllers.register);

router.post('/login/',userControllers.loginUser);

module.exports=router;