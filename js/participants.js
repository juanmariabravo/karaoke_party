import { state } from './config.js';

// Añadir participante
export async function addParticipant(saveToFile) {
    const input = document.getElementById('newParticipantInput');
    const name = input.value.trim();

    if (!name) {
        alert('Escribe un nombre');
        return;
    }

    if (state.participantes.includes(name)) {
        alert('Este participante ya existe');
        return;
    }

    state.participantes.push(name);
    const success = await saveToFile('participantes.json', state.participantes);

    if (success) {
        input.value = '';
        return true;
    } else {
        state.participantes.pop();
        alert('Error al guardar el participante');
        return false;
    }
}

// Eliminar participante
export async function deleteParticipant(name, saveToFile) {
    //if (!confirm(`¿Eliminar a ${name}?`)) return false;

    const index = state.participantes.indexOf(name);
    if (index > -1) {
        state.participantes.splice(index, 1);
        const success = await saveToFile('participantes.json', state.participantes);

        if (success) {
            return true;
        } else {
            state.participantes.splice(index, 0, name);
            alert('Error al eliminar el participante');
            return false;
        }
    }
    return false;
}
