// Dados e funções de ficha
class Ficha {
    constructor(id) {
        this.id = id;
        this.nome = "Jogador " + id;
        this.atributos = {
            vida: 1, forca: 1, int: 1,
            vigor: 1, carisma: 1, def: 1, disc: 1
        };
        this.slots = Array(4).fill(null);
        this.element = this.criarElemento();
        this.graficoRadar = this.criarRadar();
        this.atualizarRadar();
    }

    criarElemento() {
        const fichaDiv = document.createElement("div");
        fichaDiv.classList.add("ficha");
        fichaDiv.setAttribute("data-id", this.id);

        fichaDiv.innerHTML = `
    <div style="display:flex; align-items:center; margin-bottom:10px;">
        <input type="text" name="nomeJogador" value="${this.nome}">
        <button class="deleteFicha">Excluir</button>
    </div>
    <div class="slots">
        <h2>Equipamentos</h2>
        <div class="slot" data-slot="0">1ª arma</div>
        <div class="slot" data-slot="1">2ª arma</div>
        <div class="slot" data-slot="2">Roupa</div>
        <div class="slot" data-slot="3">Equipamento</div>
    </div>
    <div class="atributos">
        <h2>Atributos</h2>
        <div class="linha"><span>VIDA:</span> <input type="number" data-attr="vida" value="1" min="0" max="20"></div>
        <div class="linha"><span>FORÇA:</span> <input type="number" data-attr="forca" value="1" min="0" max="20"></div>
        <div class="linha"><span>INTELIGÊNCIA:</span> <input type="number" data-attr="int" value="1" min="0" max="20"></div>
        <div class="linha"><span>VIGOR:</span> <input type="number" data-attr="vigor" value="1" min="0" max="20"></div>
        <div class="linha"><span>CARISMA:</span> <input type="number" data-attr="carisma" value="1" min="0" max="20"></div>
        <div class="linha"><span>DEFESA:</span> <input type="number" data-attr="def" value="1" min="0" max="20"></div>
        <div class="linha"><span>DISCERNIMENTO:</span> <input type="number" data-attr="disc" value="1" min="0" max="20"></div>
    </div>
    <div class="radar">
        <h2>Gráfico de Atributos</h2>
        <canvas id="radar-${this.id}"></canvas>
    </div>
`;
        document.getElementById("listaFichas").appendChild(fichaDiv);

        // Nome editável
        const nomeInput = fichaDiv.querySelector("input[name=nomeJogador]");
        nomeInput.addEventListener("input", () => {
            this.nome = nomeInput.value;
        });

        // Delete
        fichaDiv.querySelector(".deleteFicha").addEventListener("click", () => {
            fichaDiv.remove();
            fichas = fichas.filter(f => f.id !== this.id);
        });

        // Atributos
        fichaDiv.querySelectorAll("input[type=number]").forEach(input => {
            input.addEventListener("input", () => {
                const attr = input.dataset.attr;
                this.atributos[attr] = Math.min(20, Math.max(0, Number(input.value)));
                this.atualizarRadar();
            });
        });

        // Drag & Drop slots
        const slotsDiv = fichaDiv.querySelectorAll(".slot");
        slotsDiv.forEach((slotDiv, index) => {
            slotDiv.addEventListener("dragover", e => {
                e.preventDefault();
                slotDiv.style.borderColor = "#aaa";
            });
            slotDiv.addEventListener("dragleave", e => {
                slotDiv.style.borderColor = "#666";
            });
            slotDiv.addEventListener("drop", e => {
                e.preventDefault();
                const idItem = e.dataTransfer.getData("text/plain");
                const item = document.getElementById(idItem);
                slotDiv.textContent = item.textContent;
                slotDiv.style.borderColor = "#666";
                this.slots[index] = item.textContent;
            });
        });

        return fichaDiv;
    }

    criarRadar() {
        const ctx = document.getElementById(`radar-${this.id}`);
        return new Chart(ctx, {
            type: "radar",
            data: {
                labels: ["VIDA", "FORÇA", "INT", "VIGOR", "CARISMA", "DEFESA", "DISCERNIMENTO"],
                datasets: [{
                    label: "Atributos",
                    data: Object.values(this.atributos),
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        min: 0,
                        max: 20,
                        ticks: { stepSize: 5 }
                    }
                }
            }

        });
    }
    atualizarRadar() {
        this.graficoRadar.data.datasets[0].data = Object.values(this.atributos);
        this.graficoRadar.update();
    }
}

// Gerenciamento de fichas
let fichas = [];
let fichaId = 1;

document.getElementById("addFicha").addEventListener("click", () => {
    const f = new Ficha(fichaId++);
    fichas.push(f);
});

// Drag & Drop catálogo global
const items = document.querySelectorAll(".item");
items.forEach(item => {
    item.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", item.id);
    });
});
// Seleciona todos os itens do catálogo
const itens = document.querySelectorAll('.item');
// Seleciona todos os slots
const slots = document.querySelectorAll('.slot');

items.forEach(item => {
  item.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', item.id);
  });
});

slots.forEach(slot => {
  slot.addEventListener('dragover', e => {
    e.preventDefault(); // necessário para permitir drop
  });

  slot.addEventListener('drop', e => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const draggedItem = document.getElementById(id);

    // Limpa o slot antes de adicionar
    slot.innerHTML = '';

    // Cria uma cópia do ícone
    const icon = draggedItem.querySelector('img').cloneNode(true);
    slot.appendChild(icon);

    // Opcional: adiciona o nome do item no slot
    const name = document.createElement('span');
    name.textContent = draggedItem.textContent.trim();
    name.style.marginLeft = '5px';
    slot.appendChild(name);
  });
  
});