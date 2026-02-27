// CONFIGURAÇÃO ATUALIZADA (Chave e Link novos)
const supabaseUrl = 'https://njxejwrdjemmrmdtenit.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeGVqd3JkamVtbXJtZHRlbml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTg5MTYsImV4cCI6MjA4Nzc3NDkxNn0.HlZh45ptmLnt09nclbrwFNKshiyhBaLkBfhfLz-5xB4'; 
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

let carrinho = [];

async function carregarProdutos() {
    const { data, error } = await _supabase.from('produtos').select('*');
    const container = document.getElementById('lista-produtos');
    
    if (error) {
        console.error("Erro:", error);
        container.innerHTML = "<p class='text-center text-red-500'>Erro ao conectar ao banco. Verifique a tabela 'produtos'.</p>";
        return;
    }

    container.innerHTML = ""; 

    data.forEach(produto => {
        container.innerHTML += `
            <div class="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all">
                <img src="${produto.imagem_url}" class="w-24 h-24 rounded-[1.5rem] object-cover bg-gray-100">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800 text-lg">${produto.nome}</h3>
                    <p class="text-xs text-gray-500 mt-1">${produto.descricao || 'Especialidade da casa'}</p>
                    <div class="flex items-center justify-between mt-3">
                        <span class="text-orange-600 font-extrabold text-xl font-mono">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                        <button onclick="adicionarAoCarrinho('${produto.nome}', ${produto.preco})" 
                                class="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-orange-100 active:scale-90">
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
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    document.getElementById('cart-count').innerText = carrinho.length;
    document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

carregarProdutos();