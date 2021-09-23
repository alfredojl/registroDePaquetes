# Introducción.

Es necesario tener instalado NodeJS, si no está instalado, se puede descargar el instalador desde la página oficial de NodeJS, en el caso de windows, o instalando directamente con el gestor de paquetes correspondiente a la distribución de linux que se esté utilizando.

Posterior a la instalación, se requiere de dos módulos llamados *nodemon* y *serve*, estos sirven para mantener corriendo (de manera local) el back y el front; para instalarlos, basta con ingresar el siguiente código:

```
npm i nodemon serve -g
```

La base de datos está diseñada para desplegarse con MongoDB, por lo que se necesita instalar MongoDB. En el caso de windows, se puede hacer descargando el instalador desde la página web oficial. En el caso de linux, se puede instalar desde el gestor de paquetes correspondiente a la distribución que se esté utilizando.
Con MongoDB no se necesita crear una base de datos, el backend lo hará automáticamente.

-----

# Instalación.

Nos ubicamos en la carpeta de front y back e ingresamos el siguiente código para la instalación de los paquetes.

```
back> npm install
front> npm install
```

Si surge algún error, podemos intentar con otro manejador de paquetes como yarn y sería de la siguiente manera:

Para instalar __*yarn*__:

```
npm install yarn -g
```

E intentamos instalar como con *__npm__*:
```
back> yarn install
front> yarn install
```

-----

# Despliegue del proyecto.

## Front
Nos ubicamos en la carpeta "front" y ejecutamos el siguiente comando:

```
front> npm run build
```

Esto nos generará una carpeta llamada "dist", la cuál contiene todo el código perteneciente al *frontend*.
Para correrlo de manera local, ingresamos:

```
front> serve dist
```
 
y se mantendrá corriendo el front en el terminal, esto mostrará una dirección IP accesible para cualquier equipo que esté conectado de manera local a la red.

## Backend
Nos ubicamos en la carpeta "back" y ejecutamos:

```
back> nodemon server/app
```

-----
