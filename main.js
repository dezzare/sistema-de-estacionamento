(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    const TOTAL_DE_VAGAS = 12;
    let vaga;
    function calculaTempo(ms) {
        const minutos = Math.floor(ms / 60000);
        const segundos = Math.floor((ms % 60000) / 1000);
        return `${minutos}min e ${segundos}s`;
    }
    function patio() {
        let vagaLivre = '-';
        let vagaOcupada = 'X';
        function selecionaVaga(id) {
            let quadrado = document.getElementById(id);
            let checker = document.getElementsByClassName('quadradoSelecionado');
            if (quadrado.innerHTML !== vagaLivre) {
                return;
            }
            else if (quadrado.classList.contains('quadradoSelecionado')) {
                quadrado.classList.remove('quadradoSelecionado');
                return;
            }
            else if (checker.length > 0) {
                alert('Só é possível selecionar uma vaga por veículo!');
                return;
            }
            else {
                quadrado.classList.add('quadradoSelecionado');
                vaga = quadrado;
            }
            // TODO
            // checaLotacao();
            // remover cor vermelha ao deletar
        }
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${veiculo.nome}</td>
        <td>${veiculo.placa}</td>
        <td>${veiculo.entrada}</td>
        <td>
          <button class="delete" data-placa="${veiculo.placa}">X</button>
        </td>
      `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva) {
                salvar([...ler(), veiculo]);
                vaga.classList.remove('quadradoSelecionado');
                vaga.classList.add('quadradoOcupado');
                vaga.innerHTML = 'X';
            }
            ;
        }
        function remover(placa) {
            const { entrada, nome } = ler().find((veiculo) => veiculo.placa === placa);
            const tempo = calculaTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) {
                vaga.classList.remove('quadradoOcupado');
                vaga.innerHTML = '-';
                return;
            }
            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            render();
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return { selecionaVaga, ler, adicionar, remover, salvar, render };
    }
    patio().render();
    // adiciona Listener a todos quadrados;
    for (let i = 1; i <= TOTAL_DE_VAGAS; i++) {
        let idQuadrado = document.getElementById(i.toString());
        idQuadrado.addEventListener("click", () => {
            patio().selecionaVaga(i.toString());
        });
    }
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert("Todos os campos devem ser preenchidos");
            return;
        }
        else if (vaga === undefined || !vaga.classList.contains('quadradoSelecionado')) {
            alert("Selecione uma vaga");
            return;
        }
        // for (let i = 0; i < classQuadrado.length; i++) {
        //   classQuadrado[i].addEventListener("click", () => {
        //     console.log(this.id)
        //     patio().selecionaVaga(this.id);
        //   });
        // }
        patio().adicionar({ nome, placa, entrada: new Date().toISOString(), vaga }, true);
        ;
    });
})();
