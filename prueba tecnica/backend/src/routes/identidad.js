var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fs = require('fs');

var usuarios = [
    { "usuario": "hernan", "password": "123", "id_persona": "1" },
    { "usuario": "cortes", "password": "123456", "id_persona": "2" },
    { "usuario": "Maria", "password": "789456", "id_persona": "3" },
    { "usuario": "Dario", "password": "456", "id_persona": "4" },
];

var personas = [
    { "nombre": "Hernan Caicedo", "edad": "26", "genero": "Maculino", "id": "1" },
    { "nombre": "Mario Cortes", "edad": "35", "genero": "Maculino", "id": "2" },
    { "nombre": "Maria Fernanda", "edad": "18", "genero": "Femenino", "id": "3" },
    { "nombre": "Dario Vanegas", "edad": "48", "genero": "Maculino", "id": "4" },
]

router.post('/login', async function (req, res, next) {

    var user = req.body;
    var datosUsuario;
    var usuarioEncontrado = false;


    if (!user)
        return res.status(500).send({ message: 'Error con los datos del usuario.' });

    usuarios.forEach((item) => {

        if (user.usuario === item.usuario && user.password === item.password) {
            usuarioEncontrado = true;
            user = item
            datosUsuario = personas.find(x => x.id === item.id_persona);
        }

    });

    if (!usuarioEncontrado) {
        return res.status(403).send({ message: 'El usuario o contraseña son incorrectos.' });
    }

    try {
        console.log('__dirname: ', __dirname);
        var cert_priv = fs.readFileSync(__dirname + '/../../certs/clave_privada.pem');
        var signOptions = {
            issuer: process.env.Issuer,
            audience: process.env.Audience,
            expiresIn: "1d",
            algorithm: "RS256"
        };

        jwt.sign({ cusu: user }, cert_priv, signOptions,
            function (err, token) {

                if (err) {
                    console.log('Error al generar el token: ', err);
                    res.status(500).send({ error: "Error" });
                }
                console.log('token: ', token);
                res.send({ response: token, data: datosUsuario });
            });

    } catch (error) {
        console.log('error: ', error);
        res.status(500).send({ error: "Error" });
    }
});

router.post('/data-user', async function (req, res, next) {

    var datosUsuario;
    var token = req.headers.authorization.replace(/['"]+/g, '');
    token = token.replace('Bearer ', '')
    var cert_priv = fs.readFileSync(__dirname + '/../../certs/clave_privada.pem');
    var decoded = jwt.decode(token, cert_priv);
    datosUsuario = personas.find(x => x.id === decoded.cusu.id_persona);
    res.send({data:datosUsuario})

});

module.exports = router;