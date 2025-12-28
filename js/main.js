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

    // Auto-ocultar elementos flotantes con inactividad (retrasar para que los elementos existan)
    setTimeout(() => {
        setupAutoHideControls();
    }, 100);
}

// Auto-ocultar controles flotantes cuando el ratón está inactivo
function setupAutoHideControls() {
    let hideTimeout;
    const hideDelay = 3000; // 3 segundos

    function getElements() {
        return [
            document.querySelector('.now-playing-immersive'),
            document.querySelector('.immersive-controls'),
            ...document.querySelectorAll('.edge-indicator'),
            document.getElementById('evolutionNextBtn')
        ].filter(el => el !== null);
    }

    function isVideoPlaying() {
        // Verificar si el reproductor existe y está reproduciendo (estado 1 = playing)
        try {
            return state.player && state.player.getPlayerState && state.player.getPlayerState() === 1;
        } catch (e) {
            return false;
        }
    }

    function showControls() {
        //console.log('mousemove detectado - isVideoPlaying:', isVideoPlaying());
        const elements = getElements();
        const overlay = document.getElementById('videoOverlay');

        elements.forEach(el => {
            el.classList.remove('hide');
        });

        // Deshabilitar overlay cuando los controles están visibles
        if (overlay) {
            overlay.style.pointerEvents = 'none';
        }

        // Cancelar timeout anterior
        clearTimeout(hideTimeout);

        // Solo programar ocultación si el video está reproduciendo
        if (isVideoPlaying()) {
            hideTimeout = setTimeout(() => {
                hideControls();
            }, hideDelay);
        }
    }

    function hideControls() {
        const overlay = document.getElementById('videoOverlay');

        // Solo ocultar si el video está reproduciendo
        if (isVideoPlaying()) {
            const elements = getElements();
            elements.forEach(el => {
                el.classList.add('hide');
            });

            // Habilitar overlay cuando los controles están ocultos
            if (overlay) {
                overlay.style.pointerEvents = 'auto';
            }
        }
    }

    // Mostrar controles al mover el ratón
    document.addEventListener('mousemove', showControls);

    // También escuchar en el overlay del video
    const videoOverlay = document.getElementById('videoOverlay');
    if (videoOverlay) {
        videoOverlay.addEventListener('mousemove', showControls);
    }

    // Ocultar controles después de 4 segundos iniciales solo si está reproduciendo
    setTimeout(() => {
        if (isVideoPlaying()) {
            hideControls();
        }
    }, 4000);
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
