let nome = {
    name: " "
}

// pedir nome do usuario e enviar ao servidor
function pedirNome() {
    nome = {
        name: prompt("Digite o seu nome")
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nome);
    promise.then(enviarAoServidor);
    promise.catch(tratarErros);
}
pedirNome();

function enviarAoServidor(resposta) {
    console.log("yes");
    console.log(resposta);
}

function tratarErros(erro) {
    console.log(erro.response);
    let statusCode = erro.response.status;
    if (statusCode !== 200 ) {
        pedirNome();
    }
}

//avisar o servidor se o usuario esta online
function userOnline() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nome);
    promise.then(setInterval);
}
setInterval(userOnline, 5000);

//buscar mensagens do servidor
const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
promise.then(buscarTxt);

function buscarTxt(resposta) {
    let mensagens = resposta.data;
    console.log(mensagens);
    let main = document.querySelector("main");
    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type === "private_message") {
            if (mensagens[i].to === nome) {
                main.innerHTML += `<div class="msg-reservadas">
                <span>(${mensagens[i].time})</span> <strong>${ mensagens[i].from }</strong> reservadamente para <strong>${nome}</strong> : ${mensagens[i].text} </div>`;
            }
       } else if (mensagens[i].type === "status") {
        main.innerHTML += `<div class="msg-status">
        <span>(${mensagens[i].time})</span>  <strong>${ mensagens[i].from }</strong>  ${mensagens[i].text} </div>`;
       }
        else {
            main.innerHTML += `<div class="msg-normal">
        <span>(${mensagens[i].time})</span> <strong>${ mensagens[i].from }</strong> para Todos: ${mensagens[i].text} </div>`;
        }
    }
    
}


