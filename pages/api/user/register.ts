import { db } from '@/database';
import { User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import { jwt, validations } from '@/utils';

type Data = 
| { message: string}
| { token: string, user:{ email:string, role:string, name:string}}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'POST':
      return registerUser(req,res)
  
    default:
      res.status(400).json({ message: 'BAD Request' })
  }
  
}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email='', password='', name=''} = req.body as{email:string, password: string, name:string}


  
  if (password.length<6 ) {
    return res.status(400).json({message:'Pass min lengthis 6 characters'})
  }
  if (name.length<3) {
    return res.status(400).json({message:'Minimun 3 Characters as name'})
  }
  if (!validations.isValidEmail(email)) {
    return res.status(400).json({message:'Formato de Correo no permitido'})
  }

  await db.connect()
  const user = await User.findOne({ email })

  if (user) {
    await db.disconnect()
    return res.status(400).json({message:'Correo Registrado'})
  }

  const newUser = new User({
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password),
    role:'client',
    name
  })
  try {
    await newUser.save({ validateBeforeSave: true})
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:'Revisar logs de server'})
  }

  const { role, _id } = newUser;
  const token = jwt.singToken(_id, email)

  return res.status(200).json({ token , user: { email, role, name}})
}
