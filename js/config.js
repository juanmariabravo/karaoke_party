// Estado global de la aplicación
export const state = {
    participantes: [],
    canciones: [],
    apiKey: '',
    player: null,
    currentEvolutionIndex: 0,
    evolutionMode: false,
    currentVideoIds: [],
    currentVideoIndex: 0,
    videoLoadTimeout: null
};

// Cargar configuración desde archivos JSON
export async function loadConfiguration() {
    try {
        // Cargar API Key
        const configResponse = await fetch('config.json');
        const config = await configResponse.json();
        state.apiKey = config.youtubeApiKey || '';

        // Cargar participantes
        const participantesResponse = await fetch('participantes.json');
        state.participantes = await participantesResponse.json();

        // Cargar canciones
        const cancionesResponse = await fetch('canciones.json');
        state.canciones = await cancionesResponse.json();

        console.log('✓ Configuración cargada correctamente');
        return true;
    } catch (error) {
        console.error('Error al cargar configuración:', error);
        alert('Error al cargar archivos de configuración.\n\nAsegúrate de:\n1. Configurar la API Key en config.json\n2. Ejecutar el servidor: python server.py\n3. Abrir http://localhost:8000');
        return false;
    }
}

// Guardar datos en archivo JSON
export async function saveToFile(filename, content) {
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filename, content })
        });

        if (!response.ok) throw new Error('Error al guardar');
        console.log(`${filename} guardado`);
        return true;
    } catch (error) {
        console.error(`Error al guardar ${filename}:`, error);
        return false;
    }
}
