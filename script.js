const apiUrl = "https://api.coincap.io/v2/assets/bitcoin";

async function obterDados() {
    try {
        const resposta = await fetch(apiUrl);
        const dados = await resposta.json();

        const nomeMoeda = dados.data.name;
        const preco = parseFloat(dados.data.priceUsd).toFixed(2);
        const variacao = parseFloat(dados.data.changePercent24Hr).toFixed(2);

        document.getElementById("nomeMoeda").textContent = nomeMoeda;
        document.getElementById("preco").textContent = `Preço: $${preco}`;
        const variacaoElemento = document.getElementById("variacao");

        variacaoElemento.textContent = `Variação: ${variacao}%`;

        if (variacao >= 0) {
            variacaoElemento.style.color = 'green';
        } else {
            variacaoElemento.style.color = 'red';
        }

        atualizarGrafico(preco);
    } catch (error) {
        console.error("Erro ao obter dados:", erro);
    }
}

setInterval(obterDados, 5000);
obterDados();

const ctx = document.getElementById("grafico").getContext("2d");
let dadosGrafico = {
    labels: [],
    datasets: [{
        label: "Preço ($)",
        borderColor: "#00ff00",
        backgroundColor: "transparent",
        data: []
    }]
};
let grafico = new Chart(ctx, {
    type: "line",
    data: dadosGrafico,
    options: {
        responsive: true,
        scales: {
            x: { display: false },
            y: { beginAtZero: false }
        }
    }
})

function atualizarGrafico(preco) {
    if (dadosGrafico.labels.length > 10){
        dadosGrafico.labels.shift();
        dadosGrafico.datasets[0].data.shift();
    }

    dadosGrafico.labels.push("");
    dadosGrafico.datasets[0].data.push(preco);

    grafico.update();
}