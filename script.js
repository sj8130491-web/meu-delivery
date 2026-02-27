// CONFIGURAÇÃO DO SEU BANCO DE DADOS
const supabaseUrl = 'https://sj8130491-web.supabase.co'; 
const supabaseKey = 'njxejwrdjemmrmdtenit'; 
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

let carrinho = [];

// FUNÇÃO PARA BUSCAR PRODUTOS NO BANCO E EXIBIR COM VISUAL MODERNO
async function carregarProdutos() {
    const { data, error } = await _supabase.from('produtos').select('*');
    const container = document.getElementById('lista-produtos');
    
    if (error) {
        console.error("Erro ao carregar:", error);
        container.innerHTML = "<p class='text-center text-red-500 font-bold'>Erro ao carregar o cardápio.</p>";
        return;
    }

    // Limpa o texto "Preparando a brasa..."
    container.innerHTML = ""; 

    // Desenha cada produto na tela
    data.forEach(produto => {
        container.innerHTML += `
            <div class="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]">
                <img src="${produto.imagem_url}" class="w-24 h-24 rounded-[1.5rem] object-cover bg-gray-100 shadow-inner">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800 text-lg">${produto.nome}</h3>
                    <p class="text-xs text-gray-500 line-clamp-2 mt-1">${produto.descricao || 'Receita especial da casa'}</p>
                    <div class="flex items-center justify-between mt-3">
                        <span class="text-orange-600 font-extrabold text-xl font-mono">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                        <button onclick="adicionarAoCarrinho('${produto.nome}', ${produto.preco})" 
                                class="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-orange-100 transition-all active:scale-90">
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// FUNÇÃO DO CARRINHO
function adicionarAoCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarInterfaceCarrinho();
}

function atualizarInterfaceCarrinho() {
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    const contador = document.getElementById('cart-count');
    const totalExibido = document.getElementById('cart-total');

    if(contador) contador.innerText = carrinho.length;
    if(totalExibido) totalExibido.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Inicia o carregamento assim que a página abre
carregarProdutos();