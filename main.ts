interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
  vaga: HTMLElement;
}

(function() {
  const $ = (query: string): HTMLInputElement | null =>
    document.querySelector(query);
  const TOTAL_DE_VAGAS = 12;
  let vaga: HTMLElement;

  function calculaTempo(ms: number) {
    const minutos = Math.floor(ms / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);

    return `${minutos}min e ${segundos}s`;
  }

  function patio() {
    let vagaLivre = '-';
    let vagaOcupada = 'X';


    function selecionaVaga(id: string) {
      let quadrado = document.getElementById(id);
      let checker = document.getElementsByClassName('quadradoSelecionado');
      if (quadrado.innerHTML !== vagaLivre) {
        return;
      } else if (quadrado.classList.contains('quadradoSelecionado')) {
        quadrado.classList.remove('quadradoSelecionado');
        return;
      } else if (checker.length > 0) {
        alert('Só é possível selecionar uma vaga por veículo!');
        return;
      } else {
        quadrado.classList.add('quadradoSelecionado');
        vaga = quadrado;
      }


      // TODO
      // checaLotacao();
    }
    function ler(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }

    function salvar(veiculos: Veiculo[]) {
      localStorage.setItem("patio", JSON.stringify(veiculos));
    }

    function adicionar(veiculo: Veiculo, salva?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${veiculo.nome}</td>
        <td>${veiculo.placa}</td>
        <td>${veiculo.entrada}</td>
        <td>
          <button class="delete" data-placa="${veiculo.placa}">X</button>
        </td>
      `;


      row.querySelector(".delete")?.addEventListener("click", function() {
        remover(this.dataset.placa);
      });

      $("#patio")?.appendChild(row);

      if (salva) {
        salvar([...ler(), veiculo])
        vaga.classList.remove('quadradoSelecionado');
        vaga.classList.add('quadradoOcupado');
        vaga.innerHTML = 'X';
      };
    }

    function remover(placa: string) {
      const { entrada, nome } = ler().find((veiculo) => veiculo.placa === placa);

      const tempo = calculaTempo(new Date().getTime() - new Date(entrada).getTime());

      if (
        !confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)
      ) {
        return;
      }
      vaga.classList.remove('quadradoOcupado');
      vaga.innerHTML = '-';
      salvar(ler().filter((veiculo) => veiculo.placa !== placa));
      render();
    }



    function render() {
      $("#patio")!.innerHTML = "";
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
    })
  }

  $("#cadastrar")?.addEventListener("click", () => {
    const nome = $("#nome")?.value;
    const placa = $("#placa")?.value;

    if (!nome || !placa) {
      alert("Todos os campos devem ser preenchidos");
      return;
    } else if (vaga === undefined || !vaga.classList.contains('quadradoSelecionado')) {
      alert("Selecione uma vaga")
      return;
    }

    // for (let i = 0; i < classQuadrado.length; i++) {
    //   classQuadrado[i].addEventListener("click", () => {
    //     console.log(this.id)
    //     patio().selecionaVaga(this.id);
    //   });
    // }
    patio().adicionar({ nome, placa, entrada: new Date().toISOString(), vaga }, true);;
  });
})();
