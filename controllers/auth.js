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
            msg:'Login Correcto',
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
    
    try{
        const {email,name,picture} = await googleVerify(req.body.token);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;
        if(!usuarioDB){
            usuario = new Usuario({
                nombre:name,
                email:email,
                password:'@@@',
                img:picture,
                google:true
            })
        }else{
            usuario = usuarioDB;
            usuario.google = true;
        }
        //guardar usuario
        await usuario.save();
        //Generar el Token - JWT
        const token = await generarJWT(usuario.id);


        res.json({
            ok:true,
            email,name,picture,
            token
        }) 
    }catch(error){
        console.log(error);
        res.status(400).json({
            ok:false,
            msg:'token no valido'
        }) 
    }
    
    
}

const renewToken = async (req,res = response) =>{
    const uid = req.uid;
    const iat = req.iat;
    const usuario = await Usuario.findById(uid);
    //Generar el Token
    const token = await generarJWT(uid);
    res.json({
        ok:true,
        token,
        usuario
    })
}

module.exports = {
    login,
    googleSigIn,
    renewToken
}