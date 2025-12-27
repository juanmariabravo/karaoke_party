# Karaoke Party

Aplicación de karaoke con gestión dinámica de participantes y canciones desde archivos de configuración JSON. Obtiene canciones de YouTube usando la API de YouTube Data v3.

## Requisitos

- Python 3.x instalado
- Una API Key de YouTube Data API v3 ([Obtener aquí](https://console.cloud.google.com/apis/credentials))

## Cómo usar

### 1. Configurar la API Key

Edita el archivo [config.json](config.json) y añade tu YouTube API Key:

```json
{
  "youtubeApiKey": "TU_YOUTUBE_API_KEY_AQUI"
}
```

### 2. Iniciar el servidor local

Abre una terminal en esta carpeta y ejecuta:

```bash
python server.py
```

Verás un mensaje como:
```
Servidor Karaoke ejecutándose en http://localhost:8000
```

### 3. Abrir la aplicación

Abre tu navegador y ve a: **http://localhost:8000/index.html**

¡Listo para cantar!

## Estructura del Proyecto

```
karaoke_party/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos de la aplicación
├── js/
│   ├── main.js            # Punto de entrada principal
│   ├── config.js          # Gestión de configuración y estado
│   ├── participants.js    # Lógica de participantes
│   ├── youtube.js         # API de búsqueda de YouTube
│   ├── player.js          # Control del reproductor
│   ├── ui.js              # Renderizado de interfaz
│   └── game-modes.js      # Modos de juego (Cantar, Ruleta, Evolución)
├── config.json            # Configuración (API Key)
├── participantes.json     # Lista de participantes
├── canciones.json         # Lista de canciones
├── server.py              # Servidor local con API
└── README.md
```

## Archivos de Configuración

### `config.json`
Almacena la API Key de YouTube:
```json
{
  "youtubeApiKey": "TU_API_KEY_AQUI"
}
```

### `participantes.json`
Lista de participantes que pueden cantar:
```json
[
  "Ana",
  "Carlos",
  "María"
]
```

### `canciones.json`
Lista de canciones disponibles para todos los modos (Ruleta y Evolución):
```json
[
  { "titulo": "Bohemian Rhapsody", "artista": "Queen", "año": 1975 },
  { "titulo": "Thriller", "artista": "Michael Jackson", "año": 1982 }
]
```

**Nota**: En el modo Evolución, las canciones se ordenan automáticamente por año.

## Funcionalidades

### Gestión de Participantes
- **Añadir**: Escribe un nombre en el campo y presiona Enter o haz clic en "Añadir"
- **Eliminar**: Haz clic en el botón "Eliminar" junto al nombre del participante

### Modos de Juego

1. **CANTAR**: Busca manualmente cualquier canción y reprodúcela
2. **RULETA**: Selección aleatoria de participante + canción
3. **EVOLUCIÓN**: Reproduce todas las canciones ordenadas por año

## Editar Configuración

Puedes editar los archivos JSON directamente o:

- **Participantes**: Usar la interfaz web (cambios se guardan automáticamente)
- **Canciones**: Editar manualmente los archivos JSON con tu editor favorito
el archivo `canciones.json`
### Formato de Canciones

```json
{
  "titulo": "Nombre de la canción",
  "artista": "Nombre del artista",
  "año": 1985
}
```

## Solución de Problemas

### "Error al cargar archivos de configuración"
- Asegúrate de que el servidor Python esté ejecutándose
- Verifica que todos los archivos JSON estén en la misma carpeta

### "Error al buscar. Verifica tu API Key"
- Comprueba que tu API Key de YouTube sea válida en [config.json](config.json)
- Verifica que la API de YouTube Data v3 esté habilitada en tu proyecto de Google Cloud

### Los cambios no se guardan
- El servidor debe estar ejecutándose para guardar cambios
- Revisa la consola del navegador (F12) para ver errores

## Notas

- El servidor debe estar ejecutándose para que la aplicación funcione correctamente
- Los archivos JSON se actualizan automáticamente al añadir/eliminar participantes
- Para detener el servidor, presiona `Ctrl+C` en la terminal
- La aplicación utiliza módulos ES6, por lo que requiere un servidor web para funcionar

## Arquitectura

El código está modularizado en los siguientes componentes:

- **config.js**: Gestión del estado global y carga de configuración
- **participants.js**: Operaciones CRUD de participantes
- **youtube.js**: Integración con YouTube Data API
- **player.js**: Control del reproductor de YouTube y manejo de errores
- **ui.js**: Renderizado de listas y elementos de interfaz
- **game-modes.js**: Lógica de los tres modos de juego
- **main.js**: Inicialización y orquestación de módulos

¡Disfruta tu fiesta de karaoke!
