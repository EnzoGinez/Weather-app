const API_KEY = "dcf8c940269008e07249b4b1bfea7ff9";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const inputCidade = document.getElementById("cidade");
const resultado = document.getElementById("resultado");

/* ENTER */
inputCidade.addEventListener("keypress", (e) => {
  if (e.key === "Enter") buscarClima();
});

/* Buscar */
async function buscarClima() {
  const cidade = inputCidade.value.trim();

  if (!cidade) {
    mostrarErro("Digite uma cidade!");
    return;
  }

  try {
    mostrarLoading();

    const dados = await obterClima(cidade);

    renderizarClima(dados);

  } catch (erro) {
    mostrarErro("Cidade não encontrada!");
  }
}

/* API */
async function obterClima(cidade) {
  const url = `${BASE_URL}?q=${encodeURIComponent(cidade)}&appid=${API_KEY}&units=metric&lang=pt_br`;

  const resposta = await fetch(url);
  const dados = await resposta.json();

  /* 🔥 TRATAMENTO DE ERRO */
  if (dados.cod !== 200) {
    throw new Error("Erro na API");
  }

  return dados;
}

/* Render com animação */
function renderizarClima(dados) {
  const clima = dados.weather[0].main.toLowerCase();

  let icone = "🌤️";
  let classe = "";

  if (clima.includes("clear")) {
    icone = "☀️";
    classe = "sun";
  } else if (clima.includes("cloud")) {
    icone = "☁️";
    classe = "cloud";
  } else if (clima.includes("rain")) {
    icone = "🌧️";
    classe = "rain";
  } else if (clima.includes("snow")) {
    icone = "❄️";
  }

  aplicarModoNoite(dados);

  resultado.innerHTML = `
    <h2>${dados.name}</h2>
    <div class="icon ${classe}">${icone}</div>
    <h1>${Math.round(dados.main.temp)}°C</h1>
    <p>${dados.weather[0].description}</p>
  `;
}

/* UI */
function mostrarLoading() {
  resultado.innerHTML = "<p>Carregando...</p>";
}

function mostrarErro(msg) {
  resultado.innerHTML = `<p style="color:red;">${msg}</p>`;
}

function aplicarModoNoite(dados) {
  const agora = new Date().getTime();

  const nascer = dados.sys.sunrise * 1000;
  const por = dados.sys.sunset * 1000;

  if (agora < nascer || agora > por) {
    document.body.classList.add("noite");
  } else {
    document.body.classList.remove("noite");
  }
}