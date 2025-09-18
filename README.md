🔐 Auth-MS

Microservicio de autenticación desarrollado con Node.js + TypeScript bajo principios de Arquitectura Hexagonal (Clean Architecture).
Permite registro, login y validación de usuarios mediante JWT y almacenamiento seguro de contraseñas con bcrypt.

Incluye un robusto sistema de manejo de errores, de forma que el frontend pueda mostrar mensajes claros y manejar formularios con validaciones precisas.

🚀 Características principales

Registro de usuarios con validación de email único.

Login de usuarios con validación de credenciales y retorno de token JWT.

Validación de token para proteger rutas privadas.

Hash de contraseñas mediante bcrypt.

JWT configurable con expiración definida en variables de entorno.

Inyección de dependencias con Inversify.

PostgreSQL como base de datos para persistencia de usuarios.

Manejo de errores avanzado con códigos de PostgreSQL y validaciones.

🏗️ Arquitectura Hexagonal

La arquitectura separa claramente las responsabilidades en capas:

src
├── infrastructure # Adaptadores (bcrypt, JWT, DAOs, etc.)
│ └── security/adapters
├── modules # Casos de uso y lógica de negocio
│ └── Auth
│ ├── controllers # Routers y endpoints
│ ├── domain # Entidades y servicios de dominio
│ ├── services # Implementaciones de servicios (TokenService, PasswordHasher)
│ ├── interfaces # DTOs y contratos de entrada/salida
│ └── schemas # Validaciones Joi
├── dependencies # Contenedor de dependencias (Inversify)
└── test # Pruebas unitarias


📊 Modelo de Base de Datos

El microservicio se conecta a una base PostgreSQL que maneja los siguientes esquemas relacionados:

<img width="795" height="838" alt="image" src="https://github.com/user-attachments/assets/7017b477-27c3-4c82-b8fa-aff027f62e24" />


Tablas principales

usuarios

Maneja credenciales y roles (user, admin).

Contraseñas encriptadas con password_hash.

generacion_envio / ciclo_guia / historico_envio

Manejan la lógica de tracking de guías y su ciclo de vida.

Los usuarios se relacionan a través de creado_por y actualizado_por.

direcciones

Datos de envío y destino.

🔑 Endpoints
Registro
POST /api/v1/register


Body:

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "123456",
  "rol": "user"
}

Login
POST /api/v1/login


Body:

{
  "email": "jane@example.com",
  "password": "123456"
}


Respuesta:

{
  "access_token": "eyJhbGciOiJIUzI1...",
  "expires_in": "15m"
}

Validar token
GET /api/v1/validate


Headers:

Authorization: Bearer <token>

⚠️ Manejo de errores

El servidor centraliza el manejo de errores con Fastify, devolviendo respuestas claras para el frontend.

Ejemplos

Email duplicado:

{
  "statusCode": 409,
  "message": "El email ya existe",
  "code": "EMAIL_ALREADY_EXISTS",
  "reqId": "xxxx"
}


Validaciones (422):

{
  "statusCode": 422,
  "message": "Datos inválidos.",
  "details": [
    { "field": "email", "message": "Campo requerido" }
  ],
  "reqId": "xxxx"
}


Errores de PostgreSQL:

{
  "statusCode": 409,
  "message": "Registro duplicado",
  "detail": "Key (email)=(jane@example.com) already exists.",
  "reqId": "xxxx"
}

📦 Instalación
# Clonar el repo
git clone https://github.com/tu-org/auth-ms.git
cd auth-ms

# Instalar dependencias
yarn install

▶️ Ejecución
# Desarrollo (con hot reload)
yarn dev

# Compilar
yarn build

# Producción
yarn start

⚙️ Variables de entorno

Las variables de entorno necesarias se encuentran adjuntas en el correo.
Ejemplo:

🧪 Tests
yarn test
<img width="1141" height="656" alt="image" src="https://github.com/user-attachments/assets/f415a095-bf3d-4dc7-920d-8f956e615a35" />


Incluye pruebas unitarias con Jest, usando mocks para servicios externos (JWT, bcrypt, PostgreSQL).

📜 Licencia

MIT © 2025
