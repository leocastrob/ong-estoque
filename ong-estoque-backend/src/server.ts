import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
// Instanciando o Prisma para conversar com o banco de dados
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/teste', (req, res) => {
  res.json({ mensagem: '🚀 API do Sistema de Estoque da ONG rodando com sucesso!' });
});

// ==========================================
// ROTAS DE PRODUTOS (DOAÇÕES)
// ==========================================

// 1. Rota para CADASTRAR um novo Produto (CREATE)
app.post('/api/produtos', async (req, res) => {
  const { nome, categoria, quantidade, validade } = req.body;

  try {
    // 1. Tenta encontrar um produto com o mesmo nome
    const produtoExistente = await prisma.produto.findFirst({
      where: { 
        nome: { equals: nome } // Você pode usar mode: 'insensitive' se quiser ignorar maiúsculas
      }
    });

    if (produtoExistente) {
      // 2. Se já existe, atualizamos somando a quantidade nova à antiga
      const produtoAtualizado = await prisma.produto.update({
        where: { id: produtoExistente.id },
        data: {
          quantidade: produtoExistente.quantidade + quantidade
        }
      });
      return res.status(200).json(produtoAtualizado);
    }

    // 3. Se não existe, cria um novo normalmente
    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        categoria,
        quantidade,
        validade: validade ? new Date(validade) : null,
      },
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao processar doação.' });
  }
});

// Rota extra para CADASTRAR VÁRIOS produtos de uma vez (BULK INSERT)
app.post('/api/produtos/lote', async (req, res) => {
  try {
    const produtos = req.body; // Agora esperamos um Array [{}, {}, ...]

    // O Prisma tem o createMany, que é otimizado para salvar listas gigantes de uma vez!
    const inseridos = await prisma.produto.createMany({
      data: produtos.map((p: any) => ({
        nome: p.nome,
        categoria: p.categoria,
        quantidade: p.quantidade,
        // Converte a data se existir, senão fica null
        validade: p.validade ? new Date(p.validade) : null,
      })),
    });

    res.status(201).json({ 
      mensagem: `${inseridos.count} produtos foram cadastrados com sucesso no estoque!` 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar produtos em lote.' });
  }
});

// 2. Rota para LISTAR todos os Produtos (READ)
app.get('/api/produtos', async (req, res) => {
  try {
    // Pedimos para o Prisma buscar todos os produtos na tabela
    const produtos = await prisma.produto.findMany({
      orderBy: {
        criadoEm: 'desc' // Traz os mais recentes primeiro
      }
    });
    
    // Retornamos a lista em formato JSON
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar os produtos.' });
  }
});

// 3. Rota para ATUALIZAR um Produto (UPDATE)
app.put('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID que vem na URL
    const { nome, categoria, quantidade, validade } = req.body;

    // Pede ao Prisma para atualizar o registro com esse ID
    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        categoria,
        quantidade,
        validade: validade ? new Date(validade) : null,
      },
    });

    res.json(produtoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar o produto.' });
  }
});

// 4. Rota para DELETAR um Produto (DELETE)
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Pede ao Prisma para deletar o registro com esse ID
    await prisma.produto.delete({
      where: { id },
    });

    // Retorna 204 (No Content), que é o padrão da web para deleção com sucesso
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deletar o produto.' });
  }
});

const PORT = process.env.PORT || 3333;

// ==========================================
// ROTAS DE MOVIMENTAÇÃO (ENTRADAS E SAÍDAS)
// ==========================================

// 1. Registrar uma nova Movimentação (e atualizar o estoque automaticamente)
app.post('/api/movimentacoes', async (req, res) => {
  try {
    const { produtoId, tipo, quantidade } = req.body;

    // 1º Passo: Buscar o produto no banco para saber quanto tem no estoque agora
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId }
    });

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    // 2º Passo: Calcular o novo estoque
    let novoEstoque = produto.quantidade;
    if (tipo === 'ENTRADA') {
      novoEstoque += quantidade;
    } else if (tipo === 'SAIDA') {
      if (produto.quantidade < quantidade) {
        return res.status(400).json({ erro: 'Estoque insuficiente para esta saída.' });
      }
      novoEstoque -= quantidade;
    } else {
      return res.status(400).json({ erro: 'Tipo de movimentação inválido. Use ENTRADA ou SAIDA.' });
    }

    // 3º Passo: Salvar a movimentação E atualizar o produto ao mesmo tempo (Transaction)
    // O $transaction garante que se um der erro, o outro é cancelado. É muito seguro!
    const [novaMovimentacao, produtoAtualizado] = await prisma.$transaction([
      prisma.movimentacao.create({
        data: {
          produtoId,
          tipo,
          quantidade
        }
      }),
      prisma.produto.update({
        where: { id: produtoId },
        data: { quantidade: novoEstoque }
      })
    ]);

    res.status(201).json({
      movimentacao: novaMovimentacao,
      estoqueAtualizado: produtoAtualizado.quantidade
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao registrar a movimentação.' });
  }
});

// 2. Listar o Histórico de Movimentações
app.get('/api/movimentacoes', async (req, res) => {
  try {
    const historico = await prisma.movimentacao.findMany({
      orderBy: { data: 'desc' },
      include: {
        produto: {
          select: { nome: true } // Traz o nome do produto junto com a movimentação!
        }
      }
    });
    res.json(historico);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar o histórico.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});