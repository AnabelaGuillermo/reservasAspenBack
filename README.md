# Backend de Reservas de Motos - Aspen

Este es el backend del sistema de reservas de motos **Aspen**, desarrollado para gestionar la disponibilidad y las reservas de motocicletas. Permite a los usuarios administradores controlar el inventario de motos, gestionar reservas, supervisar el historial de acciones y administrar los usuarios del sistema. Los usuarios pueden tener roles de **administrador** o **vendedor**.

## Características Principales

### Gestión de Motos

- Crear nuevas motocicletas.
- Editar información de motocicletas existentes.
- Eliminar motocicletas.

### Gestión de Reservas

- Crear reservas manuales.
- Editar reservas.
- Eliminar reservas.
- Registrar la entrega de reservas.

### Historial de Acciones

- Visualizar un registro de las acciones realizadas en el sistema.

### Gestión de Usuarios

- Añadir nuevos usuarios.
- Editar usuarios existentes.
- Eliminar usuarios.
- Asignar roles de admin o vendedor a los usuarios.

### Autenticación y Autorización

- Sistema de autenticación basado en tokens JWT.
- Protección de rutas según el rol del usuario (administrador/vendedor).

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript.
- **Express.js**: Framework web para Node.js.
- **MongoDB**: Base de datos NoSQL.
- **Mongoose**: ODM (Object Data Modeling) para MongoDB y Node.js.
- **bcryptjs**: Para el hasheo de contraseñas.
- **jsonwebtoken**: Para la generación y verificación de tokens de autenticación.
- **Joi**: Para la validación de esquemas de datos.
- **CORS**: Middleware para habilitar Cross-Origin Resource Sharing.
- **morgan**: Middleware para el registro de solicitudes HTTP.
- **node-cron**: Para programar tareas.
- **nodemailer**: Para el envío de correos electrónicos.
- **dotenv**: Para la gestión de variables de entorno.
- **ESLint & Prettier**: Para asegurar la calidad y el formato del código.
- **esbuild**: Para la compilación y minificación del código.

## Configuración del Entorno

### Clona el repositorio:
````bash
git clone https://github.com/AnabelaGuillermo/reservasAspenBack.git
cd reservasaspenback
````

### Instalar las dependencias
```bash
  npm install
````

### Crea el archivo .env:
Copia el archivo .env.sample a .env y configura tus variables de entorno, incluyendo la cadena de conexión a tu base de datos MongoDB, el JWT_SECRET y cualquier otra variable necesaria (por ejemplo, para Nodemailer).

## Ejecución del Proyecto

### Modo Desarrollo
Para iniciar el servidor en modo desarrollo con recarga automática:
```bash
npm run dev
````

Para cualquier consulta o sugerencia, puedes contactarme: anabela.guillermo@gmail.com
