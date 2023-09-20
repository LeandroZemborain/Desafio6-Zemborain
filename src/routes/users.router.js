import { Router } from "express";
import {usersManager} from '../managers/UsersMongo.js'
import { hashData } from "../utils.js";
import passport from 'passport';

const router = Router()

router.get('/signup',(req,res)=>{
    res.render('signup')
})
router.get('/home',async(req,res)=>{
    const {username} = req.session
    const userDB = await usersManager.findUser(username)
    if(userDB.isAdmin){
        res.redirect('/api/views/adminHome')
    } else {
        res.redirect('/api/views/clientHome')
    }
})
router.get('/clientHome',(req,res)=>{
    res.render('clientHome')
})
  router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"No pudo cerrar sesion"})
        res.redirect('/login');
    })
})
router.get('/loginWithGithub', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github', passport.authenticate('github', { failureRedirect:'/' }), (req,res) => {
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        rol: req.user.rol
    }
    res.redirect('/products')
});
router.post('/signup',async(req,res)=>{
    const {first_name,last_name,username,password} = req.body
    if(!first_name || !last_name || !username || !password){
        return res.status(400).json({message: 'Some data is missing'})
    }
    const userDB = await usersManager.findUser(username)
    if(userDB){
        return res.status(400).json({message:'Username already used'})
    }
    const hashPassword = await hashData(password)
    const newUser = await usersManager.create({...req.body,password:hashPassword})
    res.status(200).json({message: 'User created',user:newUser})
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({message: "Debe llenar los datos"});
    }
    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        req.session.user = {
            name: "CoderHouse",
            email: email,
            rol: "admin"
        }
        res.redirect('/products')
    } else{
        const user = await usersManager.findUser(email)
        if(!user){
            return res.status(400).json({ message: 'Usuario no existe, debe registrarse' });
        }
        if(!await compareData(password, user.password)){
            return res.status(401).json({ message: 'Email or Password no validos' });
        }
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: email,
            rol: user.rol,
            age: user.age
        }
        res.redirect('/products')

    }
});


export default router

/////////////////////////////////////////////////////////////

