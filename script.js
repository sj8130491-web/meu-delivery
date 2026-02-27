// Substitua o 'SUA_URL' e 'SUA_CHAVE' pelas que você tem salvas no seu bloco de notas
const supabaseUrl = 'https://sj8130491-web.supabase.co'; // Exemplo da sua URL
const supabaseKey = 'SUA_CHAVE_ANON_AQUI'; // Cole aqui a sua chave anon public
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

let carrinho = [];

async function carregarProdutos() {
    const { data, error } = await _supabase.from('produtos').select('*');
    const container = document.getElementById('lista-produtos');
    
    if (error) {
        console.error("Erro ao carregar:", error);
        return;
    }

    container.innerHTML = ""; 

    data.forEach(produto => {
        container.innerHTML += `
            <div class="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]">
                <img src="${produto.imagem_url}" class="w-24 h-24 rounded-[1.5rem] object-cover bg-gray-100">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800">${produto.nome}</h3>
                    <p class="text-xs text-gray-500 line-clamp-2 mt-1">${produto.descricao || 'Delicioso espetinho artesanal'}</p>
                    <div class="flex items-center justify-between mt-3">
                        <span class="text-orange-600 font-extrabold text-lg">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                        <button onclick="adicionarAoCarrinho('${produto.nome}', ${produto.preco})" 
                                class="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all">
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
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    document.getElementById('cart-count').innerText = carrinho.length;
    document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

carregarProdutos();