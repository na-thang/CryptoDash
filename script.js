const apiUrl = "https://api.coincap.io/v2/assets/bitcoin";
let ultimoPreco = null;

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
            x: { display: false, 
                grid: { drawBorder: false, display: false}
            },
            y: { beginAtZero: false,
                display: false,
                ticks: { display: false},
                grid: { drawBorder: false, display: false}
            }
        }
    }
})

function atualizarGrafico(preco) {
    if (dadosGrafico.labels.length > 10){
        dadosGrafico.labels.shift();
        dadosGrafico.datasets[0].data.shift();
    }
    
    let corLinha = "#00ff00";
    if (ultimoPreco !== null && preco < ultimoPreco){
        corLinha = "#ff0000";
    }

    dadosGrafico.datasets[0].borderColor = corLinha;
    dadosGrafico.datasets[0].data.push(preco);
    dadosGrafico.labels.push("");

    grafico.update();

    ultimoPreco = preco;
}