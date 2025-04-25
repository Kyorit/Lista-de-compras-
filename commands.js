let listaProdutos = [];
let comparadores = 1;

$(document).ready(function(){
    const dadosSalvos = localStorage.getItem('listaProdutos');
    if (dadosSalvos) {
        listaProdutos = JSON.parse(dadosSalvos);
    }
    atualizaLista();
})

function salvarDados(){
    localStorage.setItem('listaProdutos', JSON.stringify(listaProdutos));
}

$("header p").on("click", function(){
    let index = $(this).index();
    let sectionList = $("main section")

    $(sectionList).addClass("hidden");
    $(sectionList[index]).removeClass("hidden");

    if (index === 1) {
        atualizarListaPrecificada();
    }
})

$("#listaCompras").on("keyup", "#entradaLista", function(event){
    if (event.key === "Enter") {
        
        console.log($(this).val())

        const novoProduto = {
            nome: $(this).val().trim(),
            preco: "0.00",
            quantidade: 1
        };
        
        if (novoProduto.nome) {
            listaProdutos.push(novoProduto);
            $(this).val("");
            atualizaLista();
            salvarDados();
        }
    }
})


function atualizaLista(){
    let lista = $("#listaCompras ul");
    lista.html("");

    listaProdutos.forEach((produto,index) => {
        lista.append(`
            <li id="item${index}">
                <p>${produto.nome}</p>
                <input type="text" name="alterName" id="alterName${index}" class="hidden">
                <div>
                    <button onclick = "editarProduto(event,'editar')" class="editar">Editar</button>
                    <button onclick = "editarProduto(event,'confirmar')" class="confirma hidden">Ok</button>
                    <button onclick = "excluirProduto(event)" class="excluir">Excluir</button>
                </div>
            </li>
            `)
    });
}

function editarProduto(event,funcao){
    let index = parseInt(event.target.closest("li").id.replace("item",""));
    let novoNome = $(`#alterName${index}`);
    let nome = $(`#item${index} p`);
    let confirma = $(`#item${index} .confirma`);
    let edita = $(`#item${index} .editar`);

    confirma.toggleClass("hidden");
    edita.toggleClass("hidden");
    nome.toggleClass("hidden");
    novoNome.toggleClass("hidden");

    if (funcao == "editar"){
        novoNome[0].value = nome[0].textContent;
    } else{
        listaProdutos[index].nome = novoNome[0].value;
        atualizaLista()
    }
    salvarDados();
}

function excluirProduto(event){
    let index = parseInt(event.target.closest("li").id.replace("item",""));
    listaProdutos.splice(index,1);
    atualizaLista()
    salvarDados();
}

// ====================================================

function alteraQtd(event){
    let index = parseInt(event.target.closest("article").id.replace("produto",""));
    let quantidade = listaProdutos[index].quantidade;
    
    
    if (event.target.textContent === "+" && quantidade>=0){quantidade++;}
    if (event.target.textContent === "-" && quantidade>0){quantidade--;}

    listaProdutos[index].quantidade = quantidade;
    $(`#produto${index} .quantidade p`)[0].textContent = quantidade;

    atualizaTotal(index);
}

function atualizaTotal(index){
    let quantidade = listaProdutos[index].quantidade
    let precoProduto = listaProdutos[index].preco;
    let totalProduto = $(`#produto${index} .total span`)[0];
    let precoProd = !precoProduto ? "0.00": parseFloat(precoProduto.replace(",","."))

    totalProduto.textContent = (precoProd * quantidade).toFixed(2);

    salvarDados();
    atualizaTotalCompra();
}

function atualizaTotalCompra(){
    let totalCompra = 0;
    listaProdutos.forEach(produto => {
        totalCompra = totalCompra + (produto.preco*produto.quantidade)
    });

    $("#totalCompraValor")[0].textContent = parseFloat(totalCompra).toFixed(2)
}

$("#listaPrecificada").on("click", function(event){
    testaCampoPreco(event)
})
$("#listaPrecificada").on("touch", function(event){
    testaCampoPreco(event)
})

function testaCampoPreco(event){
    if(event.target.value === "0.00"){
        event.target.value = ""
    }
}


$("#listaPrecificada").on("keydown", function(event){
    checaEntrada(event)
})

function checaEntrada(event){
    let codes = [8,13,37,39,46,48,,96,110,188,190]
    let invalido = true;
    
    codes.forEach(code => {
        if (event.keyCode === code){
            invalido = false
        }
    });

    if (!parseInt(event.key)){
        if (invalido == true){
            event.preventDefault()
        }
    }
}

$("#listaPrecificada").on("keyup", function(event){
    let index = parseInt(event.target.closest("article").id.replace("produto",""));
    listaProdutos[index].preco = event.target.value.replace(",",".");
    atualizaTotal(index)
})


// ===========================================================


function atualizarListaPrecificada(){
    let lista = $("#listaPrecificada")
    lista.empty();
    listaProdutos.forEach((produto, index) => {
        lista.append(`
                    <article id="produto${index}">
                        <h3>${produto.nome}</h3>
                        <div>
                            <div>
                                <div class="quantidade">
                                    <button onclick="alteraQtd(event)">-</button>
                                    <p>${produto.quantidade}</p>
                                    <button onclick="alteraQtd(event)">+</button>
                                </div>
                                <div class="precoProduto">
                                    <p>R$</p>
                                    <input value="${produto.preco}" type="text">
                                </div>
                            </div>
                            <div class="total">
                                <h4>Total</h4>
                                <p>R$ <span>${parseFloat(produto.preco*produto.quantidade).toFixed(2)}</span></p>
                            </div>
                        </div>
                    </article>
        `)
    });
}


// ==============================================================

function adicionarComparador(){
    comparadores++;
    let lista = $("#listaComparadores");
    lista.append(`
            <div id="comparador${comparadores}" class="comparador">
                <h2>Produto ${comparadores}</h2>
                <div>
                    <div class="entrada">
                        <fieldset>
                            <legend>Preço</legend>
                            <input type="text" class="preco">
                        </fieldset>
                        <fieldset>
                            <legend>Quantidade</legend>
                            <input type="number" class="quantidade">
                        </fieldset>
                    </div>
                    <div class="precoUnidade">
                        <fieldset>
                            <legend>Preço / Unidade</legend>
                            <p>R$ <span class="precoPorUnidade">0.00</span></p>
                        </fieldset>
                        <button onclick="limparCampos(event)">Limpar</button>
                    </div>
                </div>
            </div>
        `)
}

function removerComparador(){
    $(`#comparador${comparadores}`).remove()
    comparadores--;
}

$("#comparadorPrecos").on("keyup", function(event){
    atualizaComparador(event);
})
$("#comparadorPrecos").on("keydown", function(event){
    checaEntrada(event);
})

function atualizaComparador(event){
    let id = event.target.closest(".comparador").id.replace("comparador","")
    let preco = parseFloat($(`#comparador${id} .preco`)[0].value.replace(",","."))
    let quantidade = parseInt($(`#comparador${id} .quantidade`)[0].value);
    let final = $(`#comparador${id} .precoPorUnidade`)[0]
    let total = preco/quantidade;
    
    final.textContent = total ? parseFloat(total).toFixed(2) : "0.00";
}


function limparCampos(event){
    id = event.target.closest(".comparador").id.replace("comparador","")
    $(`#comparador${id} .quantidade`)[0].value = "";
    $(`#comparador${id} .preco`)[0].value = "";
    atualizaComparador(event)
}
