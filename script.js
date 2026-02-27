const supabaseUrl = 'https://njxejwrdjemmrmdtenit.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeGVqd3JkamVtbXJtZHRlbml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTg5MTYsImV4cCI6MjA4Nzc3NDkxNn0.HlZh45ptmLnt09nclbrwFNKshiyhBaLkBfhfLz-5xB4'; 
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

const SEU_WHATSAPP = "49988821776"; // <-- COLOQUE SEU NÚMERO AQUI

let carrinho = [];

async function carregarProdutos() {
    const { data, error } = await _supabase.from('produto').select('*');
    const container = document.getElementById('lista-produtos');
    if (error) { container.innerHTML = "Erro ao carregar cardápio."; return; }

    container.innerHTML = ""; 
    data.forEach(item => {
        const foto = item.imagem || 'https://via.placeholder.com/150?text=Sem+Foto';
        container.innerHTML += `
            <div class="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <img src="${foto}" class="w-24 h-24 rounded-[1.5rem] object-cover bg-gray-50">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800 text-lg">${item.nome}</h3>
                    <p class="text-xs text-gray-500 mt-1">${item.descricao || ''}</p>
                    <div class="flex items-center justify-between mt-3">
                        <span class="text-orange-600 font-extrabold text-xl font-mono">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                        <button onclick="adicionarAoCarrinho('${item.nome}', ${item.preco})" 
                                class="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg active:scale-90 transition-all">
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function adicionarAoCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarBarras();
}

function atualizarBarras() {
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    document.getElementById('cart-count').innerText = carrinho.length;
    document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    document.getElementById('modal-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function abrirCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    if(carrinho.length === 0) {
        lista.innerHTML = "<p class='text-center text-gray-400 py-4'>Sua sacola está vazia...</p>";
    } else {
        lista.innerHTML = carrinho.map((item, index) => `
            <div class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <div>
                    <p class="font-bold text-gray-800">${item.nome}</p>
                    <p class="text-sm text-orange-600 font-bold">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                </div>
                <button onclick="removerItem(${index})" class="text-red-500 font-bold text-sm bg-red-50 p-2 px-3 rounded-lg">Remover</button>
            </div>
        `).join('');
    }
    document.getElementById('modal-carrinho').style.display = 'flex';
}

function fecharCarrinho() {
    document.getElementById('modal-carrinho').style.display = 'none';
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarBarras();
    abrirCarrinho();
}

async function enviarWhatsApp() {
    if (carrinho.length === 0) return alert("Sua sacola está vazia!");
    
    const nomeCliente = document.getElementById('nome-cliente').value;
    const endereco = document.getElementById('endereco').value;
    const obs = document.getElementById('observacao').value;

    if (!nomeCliente || !endereco) return alert("Por favor, preencha nome e endereço!");

    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    const listaItens = carrinho.map(i => i.nome).join(', ');

    // SALVAR NO HISTÓRICO (Supabase)
    const { error } = await _supabase.from('pedidos').insert([
        { cliente: nomeCliente, total: total, itens: listaItens, endereco: endereco }
    ]);

    if (error) console.error("Erro ao salvar pedido no banco:", error);

    // MENSAGEM WHATSAPP
    let mensagem = `*🍢 NOVO PEDIDO - ESPETINHO DO CHEFE*\n\n`;
    mensagem += `👤 *Cliente:* ${nomeCliente}\n\n`;
    carrinho.forEach(item => {
        mensagem += `• *${item.nome}* - R$ ${item.preco.toFixed(2).replace('.', ',')}\n`;
    });
    mensagem += `\n💰 *Total:* R$ ${total.toFixed(2).replace('.', ',')}`;
    mensagem += `\n📍 *Endereço:* ${endereco}`;
    if (obs) mensagem += `\n📝 *Obs:* ${obs}`;

    window.open(`https://wa.me/${SEU_WHATSAPP}?text=${encodeURIComponent(mensagem)}`, '_blank');
}

carregarProdutos();