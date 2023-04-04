const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

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

module.exports = {
    login
}