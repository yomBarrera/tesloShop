import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/database';
import { User } from '@/models';
import { jwt } from '@/utils';

type Data = 
| { message: string}
| { token: string, user:{ email:string, role:string, name:string}}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'GET':
      return checkJWT(req,res)
    default:
      res.status(400).json({ message: 'BAD Request' })
  }
  
}

const checkJWT = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  const { token = ''} = req.cookies
  let userId =''
  try {
    userId = await jwt.isValidToken( token )
  } catch (error) {
     res.status(401).json({ message: 'Token no valido' })
  }

  await db.connect()
  const user = await User.findById( userId ).lean()
  await db.disconnect()

  if (!user) {
    return res.status(400).json({message:'No existe ususario con este id'})
  }

  const {email, role, name, _id } = user;
  return res.status(200).json({ token: jwt.singToken(_id, email), user: { email, role, name}})
}
