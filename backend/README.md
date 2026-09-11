---
title: Compass
emoji: 🧭
colorFrom: gray
colorTo: gray
sdk: docker
app_port: 7860
---

# Compass Backend

API FastAPI para la guía filosófica personal Compass.

## Variables de entorno

Configura las variables reales en **Settings → Repository secrets** del Space. Nunca las incluyas en el código ni en este repositorio.

| Secret | Descripción |
|--------|-------------|
| `GROQ_DEFAULT_API_KEY` | API key de Groq para el modo gratuito |
| `MANUAL_GIST_RAW_URL` | URL raw del Gist secreto con el Manual |
| `INDICACIONES_GIST_RAW_URL` | URL raw del Gist secreto con las Indicaciones |
| `UPSTASH_REDIS_URL` | URL REST de Upstash Redis |
| `UPSTASH_REDIS_TOKEN` | Token de Upstash Redis |
| `TAVILY_API_KEY` | API key de Tavily (opcional) |
| `FRONTEND_ORIGIN` | URL pública del frontend en Netlify |

Ejemplo de placeholder (no uses valores reales en el repo):

```
GROQ_DEFAULT_API_KEY=TU_TOKEN_AQUI
MANUAL_GIST_RAW_URL=https://gist.githubusercontent.com/TU_USUARIO/TU_GIST_ID/raw/manual.txt
INDICACIONES_GIST_RAW_URL=https://gist.githubusercontent.com/TU_USUARIO/TU_GIST_ID/raw/indicaciones.txt
UPSTASH_REDIS_URL=https://TU_INSTANCIA.upstash.io
UPSTASH_REDIS_TOKEN=TU_TOKEN_AQUI
TAVILY_API_KEY=TU_TOKEN_AQUI
FRONTEND_ORIGIN=https://tu-app.netlify.app
```

## Endpoints

- `GET /` — estado básico
- `GET /api/health` — health check
- `POST /api/chat` — chat con IA
