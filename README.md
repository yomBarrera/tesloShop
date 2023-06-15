# Next.js Teslo Shop App

Para correr localmente, se necesita la base datos
```
docker-compose up -d
```

* El -d, significa __detached__

* MongoDB URL Local:
```
mongodb://localhost:27017/teslodb
```

## Configurar variables de entorno
Renombrar el archivo __.env.template__ a __.env__

* Reconstruir los modulos d enode y levantar Next
```
npm install
npm run dev
```

## Llenar la base de datos con informacion de prueba
Llamar a: 'GET in postman' a su eleccion
```
http://localhost:3000/api/seed
```
