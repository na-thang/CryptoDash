const apiUrl = "https://api.coincap.io/v2/assets/bitcoin";
let ultimoPreco = null;

async function obterDados() {
    try {
        const resposta = await fetch(apiUrl);
        const dados = await resposta.json();

        const nomeMoeda = dados.data.name;
        const preco = parseFloat(dados.data.priceUsd).toFixed(2);
        const variacao = parseFloat(dados.data.changePercent24Hr).toFixed(2);
        const precoFormato = formatarPreco(preco);

        document.getElementById("nomeMoeda").textContent = nomeMoeda;
        document.getElementById("preco").textContent = `Preço: USD ${precoFormato}`;
        const variacaoElemento = document.getElementById("variacao");

        variacaoElemento.textContent = `${variacao}%`;

        if (variacao >= 0) {
            variacaoElemento.style.color = '#2bac7b';
        } else {
            variacaoElemento.style.color = '#e84359';
        }

        atualizarGrafico(preco);
    } catch (error) {
        console.error("Erro ao obter dados:", erro);
    }
}

function formatarPreco(preco) {
    return new Intl.NumberFormat('pt-BR', {
        currency: 'USD',
    }).format(preco);
}

setInterval(obterDados, 3000);
obterDados();

const ctx = document.getElementById("grafico").getContext("2d");
let dadosGrafico = {
    labels: [],
    datasets: [{
        label: "Preço ($)",
        borderColor: "#00ff00",
        backgroundColor: "transparent",
        data: [],
        borderWidth: 2
    }]
};
let grafico = new Chart(ctx, {
    type: "line",
    data: dadosGrafico,
    options: {
        responsive: true,
        maintainAspectRadio: false,
        scales: {
            x: { display: false, 
                grid: { drawBorder: false, display: false}
            },
            y: { beginAtZero: false,
                display: false,
                ticks: { display: false},
                grid: { drawBorder: false, display: false}
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            }
        }
    }
})


function atualizarGrafico(preco) {
    if (dadosGrafico.labels.length > 10){
        dadosGrafico.labels.shift();
        dadosGrafico.datasets[0].data.shift();
    }
    
    let corLinha = "#2bac7b";
    if (ultimoPreco !== null && preco < ultimoPreco){
        corLinha = "#e84359";
    }

    dadosGrafico.datasets[0].borderColor = corLinha;
    dadosGrafico.datasets[0].data.push(preco);
    dadosGrafico.labels.push("");

    grafico.update();

    ultimoPreco = preco;
}