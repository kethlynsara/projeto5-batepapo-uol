let nome = {
    name: " "
}
let atualizarStatusUser = null;
let atualizarMsg = null;

// pedir nome do usuario e enviar ao servidor
function pedirNome() {
    nome = {
        name: prompt("Digite o seu nome")
    }

    const nomeUser = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nome);
    nomeUser.then(enviarAoServidor);
    nomeUser.catch(tratarErros);
}
pedirNome();

function enviarAoServidor(resposta) {
    atualizar();
}

function tratarErros(erro) {
    let statusCode = erro.response.status;
    if (statusCode !== 200 ) {
        pedirNome();
    }
}

//avisar o servidor se o usuario esta online
function userOnline() {
    const status = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nome);
    status.then();
}



//buscar mensagens do servidor
function pegarMsg() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(mostrarMsg);
}

function mostrarMsg(resposta) {
    let main = document.querySelector("main");
    main.innerHTML = "";
    let ultima = "";
    
    for (let i = 0; i < resposta.data.length; i++) {
        if (i == resposta.data.length - 1) {
            ultima = "ultima";
        }

        if (resposta.data[i].type === "private_message") {
            if (resposta.data[i].to === nome.name) { //verifica se a mensagem reservada eh direcionada para o user
                main.innerHTML += `<div class="msg-reservadas ${ultima}" data-identifier="message">
                <span>(${resposta.data[i].time})</span> <strong>${ resposta.data[i].from }</strong> reservadamente para <strong>${nome}</strong> : ${resposta.data[i].text} </div>`;
            }
       } else if (resposta.data[i].type === "status") {
        main.innerHTML += `<div class="msg-status ${ultima}" data-identifier="message">
        <span>(${resposta.data[i].time})</span>  <strong>${ resposta.data[i].from }</strong>  ${resposta.data[i].text} </div>`;
       }
        else {
            main.innerHTML += `<div class="msg-normal ${ultima}" data-identifier="message">
        <span>(${resposta.data[i].time})</span> <strong>${ resposta.data[i].from }</strong> para Todos: ${resposta.data[i].text} </div>`;
        }
    } 
    
    //SCROLL
    const classeUltima = document.querySelector(".ultima");
    classeUltima.scrollIntoView();
}

function atualizar() {
    atualizarStatusUser = setInterval(userOnline, 5000);
    atualizarMsg = setInterval(pegarMsg, 3000);

}

//enviar msg do user
function mandarMsgUser() {
    let texto = document.querySelector("footer input").value;
    const enviar = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", {
        from: nome.name,
        to: "Todos",
        text: texto,
        type: "message" 
    });
    enviar.then(enviarMsg);
}

//desaparecer a msg da tela após enviar
function enviarMsg(resposta) {
    const footer = document.querySelector("footer");
    footer.innerHTML = `
        <input type="text" placeholder="Escreva aqui..." />
        <ion-icon onclick="mandarMsgUser()" class="ion-icon" name="paper-plane-outline" data-identifier="send-message"></ion-icon>  
    `;
}




