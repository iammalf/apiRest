import { ROLES } from "../models/Role";
import User from "../models/User";

export const checkDuplicateUserorEmail = async (req, res, next) => {
    const user = await User.findOne({username: req.body.username})
    if (user) return res.status(400).json({message: "El Usuario ya existe"})

    const email = await User.findOne({email: req.body.email})
    if (email) return res.status(400).json({message: "El Email ya existe"})

    next();
}

export const checRolesExisted = (req, res, next) => {
    if (req.body.roles) //VERIFICAMOS SI SE AH ANVIADO LOS DATOS
     {
        for (let i = 0; i < req.body.roles.length; i++){ //RECORREMOS EL CAMPO ROL ENVIADO
            if (!ROLES.includes(req.body.roles[i])) { //COMPRAMOS LOS ROLES ENVIADOS CONL OS QUE TENEMOS EN BD
                return res.status(400).json({message: `El rol ${req.body.roles[i]} no es valido`})
            }
        }
    }
    next();
}