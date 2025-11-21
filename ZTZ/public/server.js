// --- FIREBASE CONFIGURAÇÃO ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- REFERÊNCIA AO DOCUMENTO DE FICHAS ---
const fichaDoc = doc(db, "fichas", "partida1"); // "partida1" = ID da sessão

// --- SALVAR ESTADO DAS FICHAS ---
function salvarFicha(ficha) {
    // ficha = { nomeJogador, atributos: {...}, slots: [...] }
    setDoc(fichaDoc, ficha);
}

// --- OUVIR ALTERAÇÕES EM TEMPO REAL ---
onSnapshot(fichaDoc, (docSnap) => {
    if (docSnap.exists()) {
        const ficha = docSnap.data();
        atualizarInterface(ficha);
    }
});

// --- FUNÇÃO PARA ATUALIZAR A INTERFACE ---
function atualizarInterface(ficha) {
    document.querySelector('input[name="nomeJogador"]').value = ficha.nomeJogador;

    // Atributos
    for (const attr in ficha.atributos) {
        const input = document.querySelector(`input[name="${attr}"]`);
        if (input) input.value = ficha.atributos[attr];
    }

    // Slots de equipamentos
    const slots = document.querySelectorAll(".slot");
    slots.forEach((slot, i) => {
        slot.innerHTML = "";
        if (ficha.slots[i]) {
            const img = document.createElement("img");
            img.src = ficha.slots[i];
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";
            slot.appendChild(img);
        }
    });
}

// --- EXEMPLO DE USO ---
// Sempre que o jogador muda algo, você chama:
function onMudanca() {
    const atributos = {};
    document.querySelectorAll(".atributos input[type=number]").forEach(inp => {
        atributos[inp.name] = Number(inp.value);
    });

    const slots = [];
    document.querySelectorAll(".slot img").forEach(img => {
        slots.push(img.src);
    });

    const ficha = {
        nomeJogador: document.querySelector('input[name="nomeJogador"]').value,
        atributos,
        slots
    };

    salvarFicha(ficha);
}

// --- EVENTOS ---
document.querySelectorAll(".atributos input").forEach(inp => {
    inp.addEventListener("input", onMudanca);
});

document.querySelector('input[name="nomeJogador"]').addEventListener("input", onMudanca);