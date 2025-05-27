let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let vendas = JSON.parse(localStorage.getItem('vendas')) || [];

function salvarDados() {
  localStorage.setItem('produtos', JSON.stringify(produtos));
  localStorage.setItem('vendas', JSON.stringify(vendas));
}

function atualizarListas() {
  const listaProdutos = document.getElementById('listaProdutos');
  const selectProduto = document.getElementById('selectProduto');
  const listaVendas = document.getElementById('listaVendas');

  listaProdutos.innerHTML = '';
  selectProduto.innerHTML = '';
  listaVendas.innerHTML = '';

  produtos.forEach((produto, index) => {
    listaProdutos.innerHTML += `
      <li>
        ${produto.nome} - R$ ${produto.preco} - Estoque: ${produto.qtd}
        <button onclick="editarProduto(${index})">✏️</button>
        <button onclick="deletarProduto(${index})">❌</button>
      </li>
    `;
    selectProduto.innerHTML += `<option value="${index}">${produto.nome}</option>`;
  });

  vendas.forEach(venda => {
    listaVendas.innerHTML += `<li>${venda.produto} - Quantidade: ${venda.qtd} - Data: ${venda.data}</li>`;
  });
}

function cadastrarOuAtualizarProduto() {
  const nome = document.getElementById('produtoNome').value;
  const preco = parseFloat(document.getElementById('produtoPreco').value);
  const qtd = parseInt(document.getElementById('produtoQtd').value);
  const indice = document.getElementById('produtoIndice').value;

  if (!nome || isNaN(preco) || isNaN(qtd)) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  if (indice === '') {
    // Cadastro
    produtos.push({ nome, preco, qtd });
    alert('Produto cadastrado!');
  } else {
    // Atualização
    produtos[indice] = { nome, preco, qtd };
    alert('Produto atualizado!');
    document.getElementById('btnSalvar').textContent = 'Cadastrar';
    document.getElementById('produtoIndice').value = '';
  }

  limparCampos();
  salvarDados();
  atualizarListas();
}

function editarProduto(index) {
  const produto = produtos[index];
  document.getElementById('produtoNome').value = produto.nome;
  document.getElementById('produtoPreco').value = produto.preco;
  document.getElementById('produtoQtd').value = produto.qtd;
  document.getElementById('produtoIndice').value = index;
  document.getElementById('btnSalvar').textContent = 'Atualizar';
}

function deletarProduto(index) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    produtos.splice(index, 1);
    salvarDados();
    atualizarListas();
    alert('Produto deletado!');
  }
}

function registrarVenda() {
  const index = document.getElementById('selectProduto').value;
  const qtdVendida = parseInt(document.getElementById('vendaQtd').value);

  if (isNaN(qtdVendida) || qtdVendida <= 0) {
    alert('Quantidade inválida');
    return;
  }

  const produto = produtos[index];
  if (produto.qtd < qtdVendida) {
    alert('Estoque insuficiente');
    return;
  }

  produto.qtd -= qtdVendida;
  vendas.push({
    produto: produto.nome,
    qtd: qtdVendida,
    data: new Date().toLocaleDateString()
  });

  salvarDados();
  atualizarListas();
  alert('Venda registrada!');
}

function limparCampos() {
  document.getElementById('produtoNome').value = '';
  document.getElementById('produtoPreco').value = '';
  document.getElementById('produtoQtd').value = '';
  document.getElementById('produtoIndice').value = '';
}

atualizarListas();

async function gerarRelatorioPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;

  doc.setFontSize(14);
  doc.text('Relatório de Produtos e Vendas', 10, y);
  y += 10;

  // Produtos
  doc.setFontSize(12);
  doc.text('📦 Produtos em Estoque:', 10, y);
  y += 8;

  produtos.forEach(produto => {
    doc.text(`- ${produto.nome} | Preço: R$ ${produto.preco} | Estoque: ${produto.qtd}`, 10, y);
    y += 7;
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  y += 10;
  doc.setFontSize(12);
  doc.text('🧾 Vendas Realizadas:', 10, y);
  y += 8;

  vendas.forEach(venda => {
    doc.text(`- ${venda.produto} | Quantidade: ${venda.qtd} | Data: ${venda.data}`, 10, y);
    y += 7;
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save('relatorio-vendas-estoque.pdf');
}

