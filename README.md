# Afex Prueba Técnica

## Preparar Servidor

Servidor generado con tecnología [Nodejs](https://nodejs.org) + [ExpressJS](https://expressjs.com/) + [SQLite](https://www.sqlite.org/) + [Prisma](https://www.prisma.io/).

A continuación se detallan los pasos para levantar el servidor:

- Ejecutar el comando `npm install`
- Una vez finalice la instalación de dependencias, ejecutamos `npm start`

De esta forma, se habrá levantado el servidor en el puerto 3000.

> Si desea cambiar el puerto, puede modificar el archivo **index.ts** dentro de la carpeta **src**

> Para cambiar el puerto sin modificar el archivo **index.ts**, puede crear un archivo **.env** y agregar variable **PORT=4000**

> Si se desea cargar información desde las pruebas, puedes ejecutar el comando `npm test`

## Preparar Front

El front fue generado con tecnología [Vite](https://vite.dev/) + [ReactJs](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [TailwindCSS](https://tailwindcss.com/) + [Motion](https://motion.dev/) + [ReactHotToast](https://react-hot-toast.com/)

A continuación se detallan los pasos para levantar el Front-End

- Ejecutar el comando `npm install`
- Una vez finalice la instalación de dependencias, ejecutamos `npm start`

Con esto, ya se habrá instalado todo lo necesario, y ambos ambientes estarán listos para su uso

> Los valores utilizados en **ComboBox**, **Dropdowns** y otros elementos, se encuentran dentro del archivo **dataDummy.ts**, este documento está alojado en la ruta **src/data**
