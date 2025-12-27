import { state } from './config.js';

// Renderizar listas de participantes y canciones
export function renderLists(updateSongsList) {
    const participantsList = document.getElementById('participantsList');

    participantsList.innerHTML = state.participantes.map(p =>
        `<div class="card participant-card">
            <div class="song-title"><i class="fas fa-user"></i> ${p}</div>
            <div class="participant-actions">
                <button class="small-btn btn-delete" onclick="window.karaokeApp.deleteParticipant('${p.replace(/'/g, "\\'")}')"><i class="fas fa-trash"></i> Eliminar</button>
            </div>
        </div>`
    ).join('');

    updateSongsList();
}

// Actualizar lista de canciones
export function updateSongsList() {
    const songsList = document.getElementById('songsList');
    
    // Si no existe el elemento (porque se eliminó), no hacer nada
    if (!songsList) return;
    
    const sortedSongs = state.evolutionMode ?
        [...state.canciones].sort((a, b) => a.año - b.año) : state.canciones;

    songsList.innerHTML = sortedSongs.map((s, i) =>
        `<div class="card song-card ${state.evolutionMode && i === state.currentEvolutionIndex ? 'active' : ''}">
            <div class="song-title"><i class="fas fa-music"></i> ${s.titulo}</div>
            <div class="song-artist">${s.artista}</div>
            <div class="song-year">${s.año}</div>
        </div>`
    ).join('');
}
