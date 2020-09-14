import User from '../models/User'
import jwt from 'jsonwebtoken'
import config from '../config'
import Role from '../models/Role';

export const signup = async(req, res) => {
    
    const {username, email, password, roles} = req.body; //DECLARAMOS LOS DATOS QUE VENDRAN DEL FORM



    const newUser = new User({
        username,
        email,
        password: await User.encryptPassword(password)
    })

    if (roles) {
        const foundRoles = await Role.find({name: {$in: roles}})
        newUser.roles = foundRoles.map(role => role._id)
    } else {
        const role = await Role.findOne({name: "user"})
        newUser.roles = [role._id];
    }

    const saveUser = await newUser.save();
    console.log(saveUser)

    const token = jwt.sign({id: saveUser._id}, config.SECRET, {
        expiresIn: 86400 // TOKEN EXPIRA EN 24 HORAS
    })

    res.status(200).json({token})
}

export const signin = async(req, res) => {
    const userFound = await User.findOne({email: req.body.email}).populate("roles"); //BUSQUEDA DE USUARIO POR EMAIL CONCATENADO CON LOS ROLES

    if (!userFound) return res.status(400).json({message: "Usuario no Encontrado"})

    const matchPassword = await User.comparePassword(req.body.password, userFound.password) // COMPARAMOS LA PASSWORD

    if (!matchPassword) return res.status(401).json({token: null, message: "Invalid Password"})

    const token = jwt.sign({id: userFound._id}, config.SECRET,{
        expiresIn: 86400 // TOKEN EXPIRA EN 24 HORAS
    }) // CREAMOS UN TOKEN DE SER USUARIO REGISTRADO

    console.log(userFound)

    res.json({token})
}