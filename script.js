import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcUswgeytDfSEmOphQU6fLUGBMwP1aFWM",
  authDomain: "delivery-chapeco.firebaseapp.com",
  projectId: "delivery-chapeco",
  storageBucket: "delivery-chapeco.firebasestorage.app",
  messagingSenderId: "936059632111",
  appId: "1:936059632111:web:ab4e8d6dd0874c141f1e1a",
  measurementId: "G-X7NWQ681DF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let carrinho = [];
const taxaEntrega = 5.00;
const meuNumero = "5549999999999"; 

async function carregarCardapio() {
    const container = document.getElementById('cardapio-container');
    container.innerHTML = "<p>Carregando cardápio...</p>";
    try {
        const querySnapshot = await getDocs(collection(db, "produtos"));
        const produtos = [];
        querySnapshot.forEach(doc => produtos.push({ id: doc.id, ...doc.data() }));
        renderizarProdutos(produtos);
    } catch (e) {
        container.innerHTML = "<p>Erro ao carregar produtos. Verifique o Modo de Teste no Firestore.</p>";
    }
}

function renderizarProdutos(itens) {
    const container = document.getElementById('cardapio-container');
    if (itens.length === 0) {
        container.innerHTML = "<p>Nenhum produto encontrado no banco.</p>";
        return;
    }
    container.innerHTML = itens.map(p => `
        <div class="produto-card">
            <div class="produto-info">
                <h3>${p.nome}</h3>
                <p>${p.descricao}</p>
                <div class="preco">R$ ${parseFloat(p.preco).toFixed(2)}</div>
                <button class="btn-add" onclick="adicionarNoCarrinho('${p.nome}', ${p.preco})">ADICIONAR +</button>
            </div>
            <img src="${p.foto}" class="produto-foto">
        </div>
    `).join('');
}

window.filtrar = async function(cat) {
    const querySnapshot = await getDocs(collection(db, "produtos"));
    const todos = [];
    querySnapshot.forEach(doc => todos.push({ id: doc.id, ...doc.data() }));
    if (cat === 'Todos') renderizarProdutos(todos);
    else renderizarProdutos(todos.filter(p => p.categoria === cat));
}

window.adicionarNoCarrinho = function(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarCarrinho();
}

window.atualizarCarrinho = function() {
    const lista = document.getElementById('itens-carrinho');
    const totalTxt = document.getElementById('valor-total');
    const entrega = document.getElementById('metodo-entrega').value;
    lista.innerHTML = carrinho.map(i => `<p>✅ ${i.nome} - R$ ${parseFloat(i.preco).toFixed(2)}</p>`).join('');
    let soma = carrinho.reduce((acc, i) => acc + parseFloat(i.preco), 0);
    if (entrega === "entrega" && soma > 0) soma += taxaEntrega;
    totalTxt.innerText = `R$ ${soma.toFixed(2)}`;
}

window.enviarWhatsApp = function() {
    if (carrinho.length === 0) return alert("Carrinho vazio!");
    const endereco = document.getElementById('endereco').value;
    const total = document.getElementById('valor-total').innerText;
    if (!endereco) return alert("Digite o endereço!");
    let msg = `*NOVO PEDIDO*\n\n${carrinho.map(i => `• ${i.nome}`).join('\n')}\n\n*Total:* ${total}\n*Endereço:* ${endereco}`;
    window.open(`https://wa.me/${meuNumero}?text=${encodeURIComponent(msg)}`);
}

carregarCardapio();