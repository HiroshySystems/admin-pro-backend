const {response} = require('express');
const bcrypt = require('bcryptjs');

const Usuario  = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req,res)=>{

    const usuarios = await Usuario.find({},'nombre email role google');
    res.json({
        ok:true,
        usuarios,
        uid : req.uid
    })
}

const crearUsuario = async (req,res = response)=>{

    const { email, password, nombre } = req.body;

    

    try {

        const existeEmail = await Usuario.findOne({ email});

        if (existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'El correo ya esta registrado'
            })
        }
        const usuario = new Usuario ( req.body);
        //emcriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);

        
        //guardar usuario
        await usuario.save();

        //Generar el Token
        const token = await generarJWT(usuario.id);
        
        res.json({
            ok:true,
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado...revisar logs'
        })
    }

}

const actualizarUsuario = async(req,res = response) =>{

    const uid = req.params.id;
    //const {} = req.body; para recuperar los campos
    try{
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario con el id'
            })
        }
        // TODO: Validar token y comprobar si es el usuario correcto

        //Actualizar
        // otra forma, llave 1 
        //const campos = req.body;
        const {password,google,email,...campos} = req.body;

        //solo por si queremos validar adicional por el email y quitarlo
        if(usuarioDB.email !== email){   
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){
                return res.status(400).json({
                    ok:false,
                    msg:'Ya existe un usuario con ese email'
                })
            }
        }
        // otra forma, llave 1 
        // delete campos.password;
        // delete campos.google;

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos,{new:true});  //{new:true} es para que muestre la data nueva
        
        res.json({
            ok:true,
            usuario:usuarioActualizado
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado put'
        })
    }
}

const borrarUsuario = async (req,res = response) =>{
    const uid = req.params.id;
    try {    
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario con el id'
            })
        }
        
        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok:true,
            msg:'Usuario eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado delete'
        })
    }
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
}