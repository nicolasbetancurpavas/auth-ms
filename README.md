🔐 Auth-MS

Microservicio de autenticación y autorización desarrollado con Node.js + TypeScript siguiendo los principios de Arquitectura Hexagonal (Clean Architecture).
Se encarga de la gestión de usuarios, login, generación y validación de tokens JWT, además de proteger la infraestructura mediante hashing de contraseñas con bcrypt.

🚀 Características

Registro y autenticación de usuarios (/register, /login).

Generación de tokens JWT con expiración configurable.

Hashing de contraseñas con bcrypt.

Arquitectura hexagonal (separación clara entre dominio, infraestructura y aplicación).

Uso de Inversify para inyección de dependencias.

PostgreSQL como base de datos (ejemplo con repositorios y DAOs).

Validación de esquemas con Joi.

Escalabilidad mediante módulos desacoplados.

🏗️ Arquitectura

La estructura del proyecto sigue la filosofía hexagonal:

src
 ├── infrastructure       # Adaptadores (bcrypt, JWT, DAOs, etc.)
 │   └── security/adapters
 ├── modules              # Casos de uso y lógica de negocio
 │   └── Auth
 │       ├── controllers  # Routers y endpoints
 │       ├── domain       # Entidades y servicios de dominio
 │       ├── services     # Implementaciones de servicios (ej. TokenService, PasswordHasher)
 │       ├── interfaces   # DTOs y contratos de entrada/salida
 │       └── schemas      # Validaciones Joi
 ├── dependencies         # Contenedor de dependencias (Inversify)
 └── test                 # Pruebas unitarias

📦 Instalación
# Clonar el repo
git clone https://github.com/tu-org/auth-ms.git
cd auth-ms

# Instalar dependencias
yarn install


Configura las variables de entorno en un archivo .env:

PORT=8081
JWT_SECRET=supersecretkey
ACCESS_TOKEN_TTL=15m
DATABASE_URL=postgres://user:password@localhost:5432/authdb

▶️ Ejecución
# Desarrollo (hot reload con ts-node-dev o equivalente)
yarn dev

# Compilación
yarn build

# Producción
yarn start

🔑 Endpoints principales
Registro
POST /api/v1/register


Body:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "rol": "user"
}

Login
POST /api/v1/login


Body:

{
  "email": "john@example.com",
  "password": "123456"
}


Respuesta:

{
  "access_token": "eyJhbGciOiJIUzI1...",
  "expires_in": "15m"
}

🧩 Dependencias clave

bcrypt
 – Hash de contraseñas.

jsonwebtoken
 – Tokens JWT.

inversify
 – Inyección de dependencias.

pg-promise
 – Acceso a PostgreSQL.

joi
 – Validación de esquemas.

🧪 Tests
yarn test


Se incluyen pruebas unitarias con Jest y mocks de dependencias.
