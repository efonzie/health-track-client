import { Storage, API } from "aws-amplify";

const API_NAME = "health-track";

export async function s3Upload(file) {
    const filename = `${Date.now()}-${file.name}`;

    const stored = await Storage.vault.put(filename, file, {
        contentType: file.type
    });

    return stored.key;
}

export async function s3Remove(key) {
    const removed = await Storage.vault.remove(key);

    return removed.key;
}

export async function createNote(noteBody) {
    return API.post(API_NAME, "/notes", {
        body: noteBody
    });
}

export async function updateNote(noteId, noteBody) {
    return API.put(API_NAME, `/notes/${noteId}`, {
        body: noteBody
    });
}

export async function deleteNote(noteId) {
    API.del(API_NAME, `/notes/${noteId}`)
}

export async function getNotes() {
    return API.get(API_NAME, "/notes");
}

export async function loadHabits() {
    try {
        const configs = await API.get(API_NAME, "/configs");
        if (configs) {
            return configs.habits;
        }
    } catch (e) {
        console.log(e.response)
        alert(e);
    }
    return [];
}

export async function saveGoal(habit, target, measure) {
    return API.post(API_NAME, "/goals", {
        body: { habit, target, measure }
    });
}

export async function removeGoal(goalId) {
    API.del(API_NAME, `/goals/${goalId}`)
}

export async function getGoalProgress() {
    return API.get(API_NAME, "/goals/progress");
}

export async function getGoalSummary() {
    return API.get(API_NAME, "/goals/summary");
}
