const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");


const fileUpload = (req,res = response)=>{

    const tipo = req.params.tipo;
    const id = req.params.id;

    //validar tipo
    const tiposValidos = ['hospitales','medicos','usuarios'];
    if(!tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok:false,
            msg:'Debe ser un medico,usuario u hospital (tipo)'
        })  
    }

    //validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            msg:'No hay ningun archivo enviado'
        });
    }

    //procesar la imagen
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension
    const extValidas = ['png','jpg','jpeg','gif'];
    if(!extValidas.includes(extArchivo)){
        return res.status(400).json({
            ok:false,
            msg:'No es una extension permitida'
        })  
    }

    //Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extArchivo}`;

    //Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //mover la imagen
    file.mv(path, (err) =>{
        if (err){
            console.log(err);
            return res.status(500).json({
                ok:false,
                msg:'Error al mover la imagen'
            });
        }
        //Actualizar base de datos
        actualizarImagen(tipo,id,nombreArchivo);
        res.json({
            ok:true,
            msg:'Archivo subido',
            nombreArchivo
        })
    });    
}

const retonaImagen = (req,res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname,`../uploads/${tipo}/${foto}`);

    //imagen por defecto
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const no_img = path.join(__dirname,`../uploads/no-img.png`);
        res.sendFile(no_img);
    }
    
}

module.exports={
    fileUpload,
    retonaImagen
}
