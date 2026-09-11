# Compass

Monorepo de una web de chat con IA que actúa como guía filosófica personal.

## Estructura del proyecto

```
compass/
  frontend/          Preact + Vite + Tailwind
  backend/           FastAPI + Python 3.11+
  start.sh           Script de inicio (Linux/Mac)
  start.bat          Script de inicio (Windows)
  README.md
  .gitignore
  .env.example
```

### Frontend

- Preact con TypeScript
- Vite como bundler
- Tailwind CSS para estilos
- lucide-preact para íconos

### Backend

```
backend/
  app/
    main.py          Punto de entrada FastAPI
    config.py        Configuración y variables de entorno
    routers/         Endpoints HTTP
    services/        Lógica de negocio
    models/          Schemas Pydantic
    core/            Seguridad, rate limit, utilidades
  requirements.txt
  Dockerfile
  .env.example
```

## Cómo correr localmente

### Windows

```bat
start.bat
```

### Linux / Mac

```bash
chmod +x start.sh
./start.sh
```

Los scripts verifican que Node.js y Python estén instalados, instalan dependencias si faltan, y levantan ambos servicios en paralelo:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000

### Ejecución manual (alternativa)

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno necesarias

Variables del backend (ver `backend/.env.example`). En producción, configúralas en el panel de **Hugging Face Spaces → Repository Secrets**, nunca en el repositorio.

| Variable | Descripción |
|----------|-------------|
| `APP_NAME` | Nombre de la app |
| `API_HOST` | Host del servidor |
| `API_PORT` | Puerto del servidor |
| `FRONTEND_ORIGIN` | Origen del frontend en producción (ej. URL de Netlify) |
| `MANUAL_GIST_RAW_URL` | URL raw del Gist secreto con el Manual |
| `INDICACIONES_GIST_RAW_URL` | URL raw del Gist secreto con las Indicaciones |
| `GEMINI_DEFAULT_API_KEY` | API key de Gemini para modo gratuito (usando Gemini 2.5 Flash) |
| `TAVILY_API_KEY` | API key de Tavily para búsqueda web opcional |
| `UPSTASH_REDIS_URL` | URL REST de Upstash Redis (rate limit) |
| `UPSTASH_REDIS_TOKEN` | Token de Upstash Redis |

**Nota:** El modo gratuito usa Gemini 2.5 Flash en lugar de Groq porque Gemini soporta ~250.000 TPM y hasta 1M tokens de contexto, necesario para procesar el prompt de sistema completo (~60.000-70.000 tokens). Groq tiene un límite de ~6.000-12.000 TPM que no es suficiente.

Los documentos Manual e Indicaciones **nunca** se suben al repo. Se cargan en memoria al arrancar desde Gists secretos y se refrescan cada 10 minutos.

### Seguridad de API keys del usuario (BYOK)

- El transporte viaja cifrado por HTTPS (TLS).
- El backend **no persiste** la API key del usuario: no se loggea, no se escribe a disco, no se cachea. Se usa solo dentro del scope de la llamada al proveedor y se descarta.

### Rate limit (modo gratuito)

- Máximo 3 mensajes por día por cliente (hash SHA-256 de IP + fecha UTC).
- Persistido en Upstash Redis en producción; diccionario en memoria en desarrollo local (no persiste entre reinicios).

## Tests del backend

```bash
cd backend
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
pytest
```

## Deploy

Todo el flujo usa tiers gratuitos: Netlify, Hugging Face Spaces, Upstash y Tavily (opcional).

### 1. Gists secretos (Manual e Indicaciones)

1. Creá dos **Gists secretos** en GitHub: uno para el Manual, otro para las Indicaciones.
2. Copiá la URL **raw** de cada Gist (botón "Raw" → copiar URL del navegador).
3. Esas URLs van solo en los secrets del Space de Hugging Face, nunca en el repo.

### 2. Backend en Hugging Face Spaces

1. Creá una cuenta gratuita en [huggingface.co](https://huggingface.co).
2. Creá un Space nuevo, tipo **Docker**, apuntando a la carpeta `backend/` del repo.
3. En **Settings → Repository secrets**, configurá:

| Secret | Valor |
|--------|-------|
| `GEMINI_DEFAULT_API_KEY` | Tu API key de Gemini |
| `MANUAL_GIST_RAW_URL` | URL raw del Gist del Manual |
| `INDICACIONES_GIST_RAW_URL` | URL raw del Gist de Indicaciones |
| `UPSTASH_REDIS_URL` | URL REST de Upstash |
| `UPSTASH_REDIS_TOKEN` | Token de Upstash |
| `FRONTEND_ORIGIN` | URL de Netlify (ej. `https://tu-app.netlify.app`) |
| `TAVILY_API_KEY` | *(opcional)* API key de Tavily |

4. El Space expone el backend en su URL pública (puerto 7860 internamente).

### 3. Upstash Redis (rate limit)

1. Creá una cuenta gratuita en [upstash.com](https://upstash.com).
2. Creá una base Redis gratuita.
3. Copiá **UPSTASH_REDIS_REST_URL** y **UPSTASH_REDIS_REST_TOKEN** a los secrets del Space.

### 4. Tavily (opcional)

1. Creá una cuenta gratuita en [tavily.com](https://tavily.com).
2. Copiá la API key al secret `TAVILY_API_KEY` del Space.

### 5. Frontend en Netlify

1. Conectá el repo de GitHub a [netlify.com](https://netlify.com).
2. Configurá el build:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build` (también definido en `frontend/netlify.toml`)
   - **Publish directory:** `dist`
3. En **Site settings → Environment variables**, agregá:

| Variable | Valor |
|----------|-------|
| `VITE_API_BASE_URL` | URL pública del Space de Hugging Face (ej. `https://usuario-compass.hf.space`) |

4. Desplegá. Un cambio en `VITE_API_BASE_URL` **requiere un nuevo deploy** (la variable se embebe en el build).

### 6. Actualizar Manual o Indicaciones (sin redeploy)

Para cambiar el contenido en el futuro:

1. Editá el Gist secreto correspondiente en [github.com/gist](https://github.com/gist) (a mano o con un script).
2. El backend lo vuelve a leer automáticamente en su próximo ciclo de refresh (máx. 10 minutos).
3. No hace falta nuevo commit, redeploy en Netlify ni rebuild en Hugging Face.

### Resumen: variables por plataforma

**Hugging Face Spaces (Repository secrets):**

```
GEMINI_DEFAULT_API_KEY
MANUAL_GIST_RAW_URL
INDICACIONES_GIST_RAW_URL
UPSTASH_REDIS_URL
UPSTASH_REDIS_TOKEN
FRONTEND_ORIGIN
TAVILY_API_KEY          (opcional)
```

**Netlify (Environment variables):**

```
VITE_API_BASE_URL       (URL del Space de Hugging Face)
```
