// CONFIGURAÇÃO DO SEU PROJETO
const supabaseUrl = 'https://njxejwrdjemmrmdtenit.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeGVqd3JkamVtbXJtZHRlbml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTg5MTYsImV4cCI6MjA4Nzc3NDkxNn0.HlZh45ptmLnt09nclbrwFNKshiyhBaLkBfhfLz-5xB4'; 
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

let carrinho = [];

// BUSCAR DADOS DA TABELA 'produto'
async function carregarProdutos() {
    // Note que aqui agora está 'produto' sem o S final
    const { data, error } = await _supabase.from('produto').select('*');
    const container = document.getElementById('lista-produtos');
    
    if (error) {
        console.error("Erro no Supabase:", error);
        container.innerHTML = "<p class='text-center text-red-500 font-bold'>Erro ao conectar ao banco. Verifique o RLS no Supabase.</p>";
        return;
    }

    container.innerHTML = ""; 

    if (!data || data.length === 0) {
        container.innerHTML = "<p class='text-center text-gray-500 py-10'>Nenhum espetinho cadastrado na tabela 'produto'.</p>";
        return;
    }

    data.forEach(item => {
        container.innerHTML += `
            <div class="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <img src="${item.imagem_url}" class="w-24 h-24 rounded-[1.5rem] object-cover bg-gray-50">
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
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    document.getElementById('cart-count').innerText = carrinho.length;
    document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Inicia a busca
carregarProdutos();