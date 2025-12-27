import { state } from './config.js';
import { searchYouTube } from './youtube.js';
import { loadVideoWithTimeout } from './player.js';

// Buscar y reproducir canción manualmente
export async function searchAndPlay() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
        // Focus en el input si está vacío
        document.getElementById('searchInput').focus();
        return;
    }

    document.getElementById('nowPlaying').textContent = 'Buscando...';
    const karaokeMode = document.getElementById('karaokeMode').checked;
    const searchMode = karaokeMode ? 'Karaoke' : 'Letra';
    const query = `${searchTerm} ${searchMode}`;
    const videoIds = await searchYouTube(query);

    if (videoIds && videoIds.length > 0) {
        state.currentVideoIds = videoIds;
        state.currentVideoIndex = 0;
        loadVideoWithTimeout(videoIds[0], window.karaokeApp.tryNextVideo);
        document.getElementById('nowPlaying').textContent = searchTerm.toUpperCase();
    } else {
        document.getElementById('nowPlaying').textContent = 'No encontrado';
    }
}

// Iniciar ruleta de canciones
export async function startRoulette() {
    if (state.participantes.length < 2 || state.canciones.length === 0) {
        alert('Se necesitan al menos 2 participantes y canciones disponibles');
        return;
    }

    const overlay = document.getElementById('rouletteOverlay');
    const singerSlot1 = document.getElementById('singerSlot1');
    const singerSlot2 = document.getElementById('singerSlot2');
    const songSlot = document.getElementById('songSlot');
    const winnerText = document.getElementById('winnerText');

    overlay.classList.add('active');
    singerSlot1.classList.add('spinning');
    singerSlot2.classList.add('spinning');
    songSlot.classList.add('spinning');
    winnerText.textContent = '';

    const spinInterval = setInterval(() => {
        singerSlot1.textContent = state.participantes[Math.floor(Math.random() * state.participantes.length)];
        singerSlot2.textContent = state.participantes[Math.floor(Math.random() * state.participantes.length)];
        const randomSong = state.canciones[Math.floor(Math.random() * state.canciones.length)];
        songSlot.textContent = randomSong.titulo;
    }, 150);

    setTimeout(async () => {
        clearInterval(spinInterval);

        // Seleccionar dos cantantes diferentes
        const selectedSinger1 = state.participantes[Math.floor(Math.random() * state.participantes.length)];
        let selectedSinger2;

        // Asegurar que el segundo cantante sea diferente del primero
        do {
            selectedSinger2 = state.participantes[Math.floor(Math.random() * state.participantes.length)];
        } while (selectedSinger2 === selectedSinger1 && state.participantes.length > 1);

        const selectedSong = state.canciones[Math.floor(Math.random() * state.canciones.length)];

        singerSlot1.textContent = selectedSinger1;
        singerSlot2.textContent = selectedSinger2;
        songSlot.textContent = selectedSong.titulo;
        singerSlot1.classList.remove('spinning');
        singerSlot2.classList.remove('spinning');
        songSlot.classList.remove('spinning');

        winnerText.textContent = `¡${selectedSinger1.toUpperCase()} y ${selectedSinger2.toUpperCase()} cantan ${selectedSong.titulo.toUpperCase()}!`;

        setTimeout(async () => {
            overlay.classList.remove('active');

            const karaokeMode = document.getElementById('karaokeMode').checked;
            const searchMode = karaokeMode ? 'Karaoke' : 'Letra';
            const query = `${selectedSong.titulo} ${selectedSong.artista} ${searchMode}`;
            const videoIds = await searchYouTube(query);

            if (videoIds && videoIds.length > 0) {
                state.currentVideoIds = videoIds;
                state.currentVideoIndex = 0;
                loadVideoWithTimeout(videoIds[0], window.karaokeApp.tryNextVideo);
                document.getElementById('nowPlaying').textContent =
                    `${selectedSinger1} y ${selectedSinger2}: ${selectedSong.titulo}`.toUpperCase();
            }
        }, 3000);
    }, 3000); // 3 segundos hasta detener la ruleta
}

// Iniciar modo evolución cronológica
export async function startEvolution() {
    if (state.canciones.length === 0) {
        alert('No hay canciones disponibles');
        return;
    }

    state.evolutionMode = true;
    state.currentEvolutionIndex = 0;
    const sortedSongs = [...state.canciones].sort((a, b) => a.año - b.año);
    window.karaokeApp.updateSongsList();
    
    const firstSong = sortedSongs[0];
    
    // Mostrar overlay de transición para la primera canción
    const overlay = document.getElementById('evolutionTransition');
    const yearEl = document.getElementById('evolutionYear');
    const songEl = document.getElementById('evolutionSong');
    const artistEl = document.getElementById('evolutionArtist');
    
    yearEl.textContent = firstSong.año;
    songEl.textContent = firstSong.titulo;
    artistEl.textContent = firstSong.artista;
    overlay.classList.add('active');
    
    setTimeout(() => {
        overlay.classList.remove('active');
        playEvolutionSong(firstSong);
    }, 3000);
}

// Reproducir canción del modo evolución
export async function playEvolutionSong(song) {
    const karaokeMode = document.getElementById('karaokeMode').checked;
    const searchMode = karaokeMode ? 'Karaoke' : 'Letra';
    const query = `${song.titulo} ${song.artista} ${searchMode}`;
    const videoIds = await searchYouTube(query);

    if (videoIds && videoIds.length > 0) {
        state.currentVideoIds = videoIds;
        state.currentVideoIndex = 0;
        loadVideoWithTimeout(videoIds[0], window.karaokeApp.tryNextVideo);
        document.getElementById('nowPlaying').textContent =
            `${song.titulo} - ${song.artista} (${song.año})`.toUpperCase();
        window.karaokeApp.updateSongsList();
    }
}
