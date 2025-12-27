import { loadConfiguration, saveToFile, state } from './config.js';
import { addParticipant, deleteParticipant } from './participants.js';
import { initYouTubePlayer, onYouTubeIframeAPIReady, onPlayerError, tryNextVideo, loadVideoWithTimeout, onPlayerStateChange } from './player.js';
import { renderLists, updateSongsList } from './ui.js';
import { searchAndPlay, startRoulette, startEvolution, playEvolutionSong, skipToNextEvolution } from './game-modes.js';

// Inicializar aplicación
async function init() {
    const success = await loadConfiguration();
    if (success) {
        renderLists(updateSongsList);
    }

    // Inicializar reproductor de YouTube
    initYouTubePlayer();

    // Configurar modo inmersivo
    setupImmersiveMode();
}

// Configurar modo inmersivo con paneles flotantes
function setupImmersiveMode() {
    // Ocultar splash screen después de 4 segundos
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.style.display = 'none';
        }
    }, 4000);

    // Paneles flotantes
    const leftPanel = document.getElementById('leftPanel');
    const rightPanel = document.getElementById('rightPanel');
    const leftTrigger = document.querySelector('.left-trigger');
    const rightTrigger = document.querySelector('.right-trigger');

    if (leftTrigger && leftPanel) {
        leftTrigger.addEventListener('mouseenter', () => {
            leftPanel.classList.add('visible');
        });

        leftPanel.addEventListener('mouseleave', () => {
            leftPanel.classList.remove('visible');
        });
    }

    if (rightTrigger && rightPanel) {
        rightTrigger.addEventListener('mouseenter', () => {
            rightPanel.classList.add('visible');
        });

        rightPanel.addEventListener('mouseleave', () => {
            rightPanel.classList.remove('visible');
        });
    }
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
    skipToNextEvolution,
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
