# bare-dotenv [![NPM version](https://img.shields.io/npm/v/bare-dotenv.svg?style=flat-square)](https://www.npmjs.com/package/bare-dotenv)

<img src="https://raw.githubusercontent.com/claudiovb/bare-dotenv/master/dotenv.svg" alt="bare-dotenv" align="right" width="200" />

**bare-dotenv** es una adaptación ligera de [dotenv](https://github.com/motdotla/dotenv) diseñada específicamente para el runtime [Bare](https://github.com/bare-js/bare). Carga variables de entorno desde un archivo `.env` al entorno de Bare usando `bare-env`.

## 🎯 Diferencias Clave del dotenv Original

- **Soporte para Bare Runtime**: Diseñado específicamente para Bare, un runtime de JavaScript ligero
- **Sin `process.env`**: Usa `bare-env` en lugar del `process.env` de Node.js (que no existe en Bare)
- **API Simplificada**: Removidas las características de encriptación/desencriptación para mantenerlo ligero
- **Sin Precarga en Runtime**: Bare no soporta la bandera `-r` de precarga como Node.js
- **Ligero**: Enfocado en funcionalidad básica sin dependencias pesadas

## 🌱 Instalación

```bash
npm install bare-dotenv --save
```

## 🏗️ Uso

### Uso Básico

Crea un archivo `.env` en la raíz de tu proyecto:

```dosini
S3_BUCKET="YOURS3BUCKET"
SECRET_KEY="YOURSECRETKEYGOESHERE"
```

Tan pronto como sea posible en tu aplicación, importa y configura bare-dotenv:

```javascript
require('bare-dotenv').config()
```

O usando ES6:

```javascript
import 'bare-dotenv/config'
```

¡Eso es todo! Tus variables de entorno ahora están disponibles a través de `bare-env`:

```javascript
const env = require('bare-env')

console.log(env.S3_BUCKET) // "YOURS3BUCKET"
console.log(env.SECRET_KEY) // "YOURSECRETKEYGOESHERE"
```

### Uso Avanzado

```javascript
const dotenv = require('bare-dotenv')

// Cargar con opciones personalizadas
const result = dotenv.config({
  path: '/custom/path/to/.env',
  debug: true,
  override: true
})

if (result.error) {
  throw result.error
}

console.log(result.parsed)
```

### Múltiples Archivos .env

```javascript
const dotenv = require('bare-dotenv')

// Cargar múltiples archivos en orden
dotenv.config({
  path: ['.env.local', '.env']
})
```

## 📖 Referencia de API

### `config(options)`

Carga variables de entorno desde archivo(s) `.env` al entorno de Bare.

#### Opciones

- **`path`** (string|array): Ruta al archivo(s) `.env`. Por defecto: `'.env'`
- **`encoding`** (string): Codificación del archivo. Por defecto: `'utf8'`
- **`debug`** (boolean): Habilitar logging de debug. Por defecto: `false`
- **`override`** (boolean): Sobrescribir variables de entorno existentes. Por defecto: `false`
- **`quiet`** (boolean): Suprimir logging. Por defecto: `true`

#### Ejemplo

```javascript
const dotenv = require('bare-dotenv')

const result = dotenv.config({
  path: '.env.production',
  debug: true,
  override: true
})

if (result.error) {
  console.error('Error cargando archivo .env:', result.error)
}
```

### `parse(src)`

Analiza variables de entorno desde una cadena o buffer.

```javascript
const dotenv = require('bare-dotenv')

const parsed = dotenv.parse('HELLO=world\nFOO=bar')
console.log(parsed) // { HELLO: 'world', FOO: 'bar' }
```

### `populate(target, parsed, options)`

Pobla un objeto objetivo con variables de entorno analizadas.

```javascript
const dotenv = require('bare-dotenv')
const env = require('bare-env')

const parsed = { HELLO: 'world' }
dotenv.populate(env, parsed, { override: true })
```

## 🔧 Configuración via Variables de Entorno

Puedes configurar bare-dotenv usando variables de entorno:

```bash
# Establecer ruta personalizada
DOTENV_CONFIG_PATH=/custom/path/.env

# Habilitar modo debug
DOTENV_CONFIG_DEBUG=true

# Sobrescribir variables existentes
DOTENV_CONFIG_OVERRIDE=true

# Establecer codificación
DOTENV_CONFIG_ENCODING=latin1

# Suprimir logging
DOTENV_CONFIG_QUIET=true
```

## 📝 Formato del Archivo .env

### Variables Básicas

```dosini
# Pares clave-valor básicos
S3_BUCKET="YOURS3BUCKET"
SECRET_KEY="YOURSECRETKEYGOESHERE"
DATABASE_URL="postgres://user:pass@localhost/db"
```

### Valores Multilínea

```dosini
# Valores multilínea (>= v15.0.0)
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----"
```

### Comentarios

```dosini
# Este es un comentario
SECRET_KEY=YOURSECRETKEYGOESHERE # comentario en línea
SECRET_HASH="something-with-a-#-hash"
```

### Valores Entre Comillas

```dosini
# Comillas simples
SINGLE_QUOTE='valor entre comillas'

# Comillas dobles (soporta \n para saltos de línea)
MULTILINE="nueva\nlínea"

# Comillas invertidas
BACKTICK_KEY=`Esto tiene comillas 'simples' y "dobles" dentro`
```

## 🚀 Ejemplos

### Aplicación Básica

```javascript
// index.js
require('bare-dotenv').config()

const env = require('bare-env')

console.log(`¡Hola ${env.USER_NAME}!`)
console.log(`Base de datos: ${env.DATABASE_URL}`)
```

### Con Opciones Personalizadas

```javascript
// config.js
const dotenv = require('bare-dotenv')

// Cargar configuración específica del entorno
const env = process.env.NODE_ENV || 'development'
dotenv.config({
  path: `.env.${env}`,
  debug: true,
  override: true
})
```

### Testing

```javascript
// test.js
const test = require('brittle')
const dotenv = require('bare-dotenv')

test('carga variables de entorno', function (t) {
  dotenv.config({ path: 'tests/.env.test' })
  
  const env = require('bare-env')
  t.is(env.TEST_VAR, 'test_value')
})
```

## ❓ FAQ

### ¿Por qué bare-dotenv no soporta encriptación?

bare-dotenv está diseñado para ser ligero y enfocado en funcionalidad básica. Las características de encriptación fueron removidas para mantener el módulo simple y evitar dependencias en `bare-crypto` que puede no soportar todos los métodos de crypto requeridos.

### ¿Por qué no hay precarga en runtime?

El runtime de Bare no soporta la bandera `-r` de precarga como Node.js. Necesitas requerir y configurar bare-dotenv explícitamente en tu código de aplicación.

### ¿Cómo es esto diferente del dotenv original?

- **Runtime**: Diseñado para Bare en lugar de Node.js
- **Entorno**: Usa `bare-env` en lugar de `process.env`
- **Características**: Removidas encriptación, precarga y otras características específicas de Node.js
- **Tamaño**: Más ligero con menos dependencias

### ¿Puedo usar esto con Node.js?

No, este módulo está diseñado específicamente para el runtime de Bare. Para Node.js, usa el paquete original [dotenv](https://github.com/motdotla/dotenv).

### ¿Qué hay sobre expansión de variables?

La expansión de variables no está soportada en bare-dotenv. Considera usar [dotenvx](https://github.com/dotenvx/dotenvx) para características avanzadas como expansión de variables y encriptación.

## 🤝 Contribuyendo

Ver [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 Licencia

Ver [LICENSE](LICENSE)

## 🙏 Agradecimientos

Este proyecto está basado en el [dotenv](https://github.com/motdotla/dotenv) original por [motdotla](https://github.com/motdotla), adaptado para el runtime de Bare.

## 📊 ¿Quién está usando bare-dotenv?

Los proyectos que usan bare-dotenv a menudo usan la [palabra clave "bare-dotenv" en npm](https://www.npmjs.com/search?q=keywords:bare-dotenv).
