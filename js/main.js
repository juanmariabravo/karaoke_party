import { loadConfiguration, saveToFile, state } from './config.js';
import { addParticipant, deleteParticipant } from './participants.js';
import { initYouTubePlayer, onYouTubeIframeAPIReady, onPlayerError, tryNextVideo, loadVideoWithTimeout, onPlayerStateChange } from './player.js';
import { renderLists, updateSongsList } from './ui.js';
import { searchAndPlay, startRoulette, startEvolution, playEvolutionSong } from './game-modes.js';

// Inicializar aplicación
async function init() {
    const success = await loadConfiguration();
    if (success) {
        renderLists(updateSongsList);
    }

    // Inicializar reproductor de YouTube
    initYouTubePlayer();
}

// Exponer funciones globales para uso desde HTML
window.karaokeApp = {
    addParticipant: async () => {
        const success = await addParticipant(saveToFile);
        if (success) renderLists(updateSongsList);
    },
    deleteParticipant: async (name) => {
        const success = await deleteParticipant(name, saveToFile);
        if (success) renderLists(updateSongsList);
    },
    searchAndPlay,
    startRoulette,
    startEvolution,
    tryNextVideo: () => tryNextVideo(loadVideoWithTimeout),
    updateSongsList
};

// Callback global para YouTube API
window.onYouTubeIframeAPIReady = () => {
    onYouTubeIframeAPIReady(
        (event) => onPlayerStateChange(event, playEvolutionSong),
        (event) => onPlayerError(event, window.karaokeApp.tryNextVideo)
    );
};

// Iniciar aplicación al cargar la página
window.addEventListener('DOMContentLoaded', init);
