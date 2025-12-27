import { state } from './config.js';

// Buscar videos en YouTube
export async function searchYouTube(query) {
    if (!state.apiKey) {
        alert('Configura tu YouTube API Key en el archivo config.json');
        return null;
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&key=${state.apiKey}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            // Devolver array de video IDs como alternativas
            return data.items.map(item => item.id.videoId);
        }
        return null;
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar. Verifica tu API Key en config.json');
        return null;
    }
}
