## 🔐 Auth-MS

Microservicio de **autenticación** desarrollado con **Node.js + TypeScript** bajo principios de **Arquitectura Hexagonal (Clean Architecture)**.  
Permite **registro, login y validación** de usuarios mediante **JWT** y almacenamiento seguro de contraseñas con **bcrypt**.

Incluye un robusto sistema de **manejo de errores**, de forma que el frontend pueda mostrar mensajes claros y manejar formularios con validaciones precisas.

> Base path: `http://localhost:${PORT}/${DOMAIN}/${SERVICE_NAME}/api/v1`  
> Ejemplo local por defecto: `http://localhost:8081/tracking/auth-ms/api/v1` (usar esta que es la que consume el front)

---

### 🚀 Características principales

- Registro de usuarios con validación de email único.  
- Login de usuarios con validación de credenciales y retorno de token JWT.  
- Validación de token para proteger rutas privadas.  
- Hash de contraseñas mediante bcrypt.  
- JWT configurable con expiración definida en variables de entorno.  
- Inyección de dependencias con Inversify.  
- PostgreSQL como base de datos para persistencia de usuarios.  
- Manejo de errores avanzado con códigos de PostgreSQL y validaciones.  

---

## 🏗️ Arquitectura Hexagonal

La arquitectura separa claramente las responsabilidades en capas. **Estructura real del proyecto:**

```
src
 ├── shared/
 │   └── config/                          # ENV, constantes compartidas
 ├── infrastructure/
 │   ├── security/
 │   │   └── adapters/                    # BcryptPasswordHasher, JwtTokenService
 │   └── database/
 │       └── dao/                         # UserDAO (pg-promise), querys
 ├── modules/
 │   ├── utils/
 │   │   └── index.ts
 │   └── Auth/
 │       ├── controllers/                 # AuthRouter
 │       ├── dependencies/                # TypesDependencies, Dependencies.ts
 │       ├── domain/
 │       │   ├── entities/                # DataInterface, modelos de dominio
 │       │   ├── repositories/            # Contratos (UserRepository, etc.)
 │       │   └── services/                # AuthDomainServices (PasswordHasher, TokenService)
 │       ├── interfaces/                  # IRegisterUser, ILoginUser
 │       ├── schemas/                     # Validaciones (Joi/AJV)
 │       ├── usecase/                     # RegisterUserUseCase, LoginUserUseCase, ValidateTokenUseCase
 │       └── test/                        # Pruebas unitarias
 ├── AuthModules.ts
 └── index.ts
```

---

## 📊 Modelo de Base de Datos

El microservicio se conecta a una base PostgreSQL que maneja los siguientes esquemas relacionados:

<img width="795" height="838" alt="image" src="https://github.com/user-attachments/assets/7017b477-27c3-4c82-b8fa-aff027f62e24" />

### Tablas principales

- **usuarios**  
  Maneja credenciales y roles (`user`, `admin`).  
  Contraseñas encriptadas con `password_hash`.  

- **generacion_envio / ciclo_guia / historico_envio**  
  Manejan la lógica de tracking de guías y su ciclo de vida.  
  Los usuarios se relacionan a través de `creado_por` y `actualizado_por`.  

- **direcciones**  
  Datos de envío y destino.  

---

## 🔑 Endpoints

> Prefijo común: `/${DOMAIN}/${SERVICE_NAME}/api/v1`

### Registro
```
POST /api/v1/register
```
**Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "123456",
  "rol": "user"
}
```

### Login
```
POST /api/v1/login
```
**Body**:
```json
{
  "email": "jane@example.com",
  "password": "123456"
}
```
**Respuesta**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "expires_in": "15m"
}
```

### Validar token
```
GET /api/v1/validate
```

---

## ⚠️ Manejo de errores

El servidor centraliza el manejo de errores con **Fastify**, devolviendo respuestas claras para el frontend.

Ejemplos:

<img width="1023" height="791" alt="image" src="https://github.com/user-attachments/assets/4ebf3e22-3ead-44ed-aa9a-539acbf2b34e" />

**Email duplicado:**
```json
{
  "statusCode": 409,
  "message": "El email ya existe",
  "code": "EMAIL_ALREADY_EXISTS",
  "reqId": "xxxx"
}
```

**Validaciones (422):**
```json
{
  "statusCode": 422,
  "message": "Datos inválidos.",
  "details": [
    { "field": "email", "message": "Campo requerido" }
  ],
  "reqId": "xxxx"
}
```

**Errores de PostgreSQL:**
```json
{
  "statusCode": 409,
  "message": "Registro duplicado",
  "detail": "Key (email)=(jane@example.com) already exists.",
  "reqId": "xxxx"
}
```

---

## 📦 Instalación

### Clonar el repo
```bash
git clone https://github.com/nicolasbetancurpavas/auth-ms.git
cd auth-ms
```

### Instalar dependencias
```bash
yarn install
```

Configura las variables de entorno en un archivo `.env` (**adjuntas en el correo**).

---

## ▶️ Ejecución

### Desarrollo (con hot reload)
```bash
yarn dev
```

### Compilar
```bash
yarn build
```

### Producción
```bash
yarn start
```

---

## ⚙️ Variables de entorno

Las variables de entorno necesarias se encuentran **adjuntas en el correo**.  
Ejemplo:

```env
PORT=8081
DOMAIN=tracking
SERVICE_NAME=auth-ms
JWT_SECRET=supersecretkey
ACCESS_TOKEN_TTL=15m
DATABASE_URL=postgres://user:password@localhost:5432/authdb
ALLOWED_ORIGIN=http://localhost:3000
```

---

## 🧪 Tests
```bash
yarn test
```

Incluye pruebas unitarias con **Jest**, usando mocks para servicios externos (JWT, bcrypt, PostgreSQL).

---

## 📜 Licencia

MIT © 2025
