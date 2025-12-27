import { state } from './config.js';

// Inicializar el reproductor de YouTube
export function initYouTubePlayer() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Callback cuando la API de YouTube está lista
export function onYouTubeIframeAPIReady(onStateChange, onError) {
    state.player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0
        },
        events: {
            onStateChange: onStateChange,
            onError: onError
        }
    });
}

// Manejar errores del reproductor
export function onPlayerError(event, tryNextVideo) {
    console.log(`Error del reproductor: código ${event.data}`);

    // Intentar siguiente video para cualquier error
    if (event.data === 2 || event.data === 5 || event.data === 100 || event.data === 101 || event.data === 150) {
        console.log('Video no reproducible, intentando con alternativa...');
        tryNextVideo();
    }
}

// Intentar cargar el siguiente video alternativo
export function tryNextVideo(loadVideoWithTimeout) {
    clearTimeout(state.videoLoadTimeout);
    state.currentVideoIndex++;

    if (state.currentVideoIndex < state.currentVideoIds.length) {
        console.log(`Intentando video alternativo ${state.currentVideoIndex + 1}/${state.currentVideoIds.length}`);
        loadVideoWithTimeout(state.currentVideoIds[state.currentVideoIndex]);
    } else {
        document.getElementById('nowPlaying').textContent = 'No hay videos disponibles';
        console.error('No hay más videos alternativos disponibles');
    }
}

// Cargar video con timeout de detección
export function loadVideoWithTimeout(videoId, tryNextVideoCallback) {
    clearTimeout(state.videoLoadTimeout);

    state.player.loadVideoById(videoId);

    state.videoLoadTimeout = setTimeout(() => {
        const playerState = state.player.getPlayerState();
        if (playerState === -1 || playerState === 5) {
            console.log('⏱ Timeout: Video no cargó, intentando alternativa...');
            tryNextVideoCallback();
        }
    }, 3000);
}

// Manejar cambios de estado del reproductor
export function onPlayerStateChange(event, playEvolutionSong) {
    // Si el video empieza a reproducirse o está en pausa, cancelar timeout
    if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.PAUSED) {
        clearTimeout(state.videoLoadTimeout);
    }

    if (event.data === YT.PlayerState.ENDED && state.evolutionMode) {
        state.currentEvolutionIndex++;
        const sortedSongs = [...state.canciones].sort((a, b) => a.año - b.año);
        if (state.currentEvolutionIndex < sortedSongs.length) {
            const nextSong = sortedSongs[state.currentEvolutionIndex];
            
            // Mostrar overlay de transición
            const overlay = document.getElementById('evolutionTransition');
            const yearEl = document.getElementById('evolutionYear');
            const songEl = document.getElementById('evolutionSong');
            const artistEl = document.getElementById('evolutionArtist');
            
            yearEl.textContent = nextSong.año;
            songEl.textContent = nextSong.titulo;
            artistEl.textContent = nextSong.artista;
            overlay.classList.add('active');
            
            setTimeout(() => {
                overlay.classList.remove('active');
                playEvolutionSong(nextSong);
            }, 3000);
        } else {
            state.evolutionMode = false;
            document.getElementById('nowPlaying').textContent = '¡Evolución Completada!';
        }
    }
}
