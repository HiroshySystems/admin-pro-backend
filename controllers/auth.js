const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req,res = response) =>{
    const {email,password} = req.body;
    try {
        //verificar email
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Login incorrecto / Email'
            });
        }

        //verificar contraseña
        const validarPassword = bcrypt.compareSync(password,usuarioDB.password);
        if(!validarPassword){
            return res.status(400).json({
                ok:false,
                msg:'Login incorrecto / Password'
            });
        }

        //Generar el Token
        const token = await generarJWT(usuarioDB.id);
        
        res.json({
            ok:true,
            msg:'hola mundo',
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error en el Login'
        })
    }
}

const googleSigIn = async(req,res=response)=>{
    const googleToken = req.body.token;
    try {
        const {name,email,picture} = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;
        if(!usuarioDB){
            //si no existe el usuario
            usuario = new Usuario({
                nombre:name,
                email,
                password:'@@@',
                img:picture,
                google:true
            })
        }else{
            //existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            usuario.password = '@@@';
        }

        //guardar en BD
        await usuario.save();


        //Generar el Token - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok:true,
            msg:'Google SignIn',
            token
        })
    } catch (error) {
        res.status(401).json({
            ok:false,
            msg:'El Token no es correcto'
        })
    }   
    
}

module.exports = {
    login,
    googleSigIn
}