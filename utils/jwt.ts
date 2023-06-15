
import jwt from "jsonwebtoken";

export const singToken = (_id:string, email:string) => {

  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("No hay semilla JWT - revisar variables de entorno");
  }
  
  return jwt.sign(
      /* Payload */ {_id,email},
      /* Seed */ process.env.JWT_SECRET_SEED,
      /* Opciones */ { expiresIn:'30d'}
  )
}
export const isValidToken = (token:string):Promise<string> => {

  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("No hay semilla JWT - revisar variables de entorno");
  }

  if (token.length <= 10 ) {
    return Promise.reject('JWT no es valido')
  }

  return new Promise((resolve, reject)=>{
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED ||'', (err, payload)=>{
        if( err ) return reject(' JWT no valido')
        const {_id} = payload as {_id:string}
        resolve(_id)
      })
    } catch (error) {
      reject(' JWT no valido ctch')
    }
  })
}
