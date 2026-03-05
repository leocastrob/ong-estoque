import { ref, computed } from 'vue'
import axios from 'axios'

// Configuração da API
const api = axios.create({ baseURL: 'http://localhost:3333/api' })

export function useEstoque() {
  const produtos = ref<any[]>([])
  const historico = ref<any[]>([])
  const carregando = ref(false)

  // --- Ações ---
  const buscarDados = async () => {
    carregando.value = true
    try {
      const [resProd, resHist] = await Promise.all([
        api.get('/produtos'),
        api.get('/movimentacoes')
      ])
      produtos.value = resProd.data
      historico.value = resHist.data
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      carregando.value = false
    }
  }

  const salvarProduto = async (novoProduto: any) => {
    try {
      await api.post('/produtos', {
        ...novoProduto,
        quantidade: Number(novoProduto.quantidade),
        validade: novoProduto.validade ? `${novoProduto.validade}T00:00:00Z` : null
      })
      await buscarDados()
    } catch (error) {
      alert("Erro ao salvar produto.")
    }
  }

  const registrarSaida = async (dadosSaida: any) => {
    try {
      await api.post('/movimentacoes', {
        produtoId: dadosSaida.produtoId,
        tipo: 'SAIDA',
        quantidade: Number(dadosSaida.quantidade)
      })
      await buscarDados()
    } catch (error: any) {
      alert(error.response?.data?.erro || "Erro ao registrar saída.")
    }
  }

  const deletarProduto = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return
    try {
      await api.delete(`/produtos/${id}`)
      await buscarDados()
    } catch (error) {
      alert("Erro ao excluir.")
    }
  }

  // --- Métricas Calculadas ---
  const total = computed(() => produtos.value.length)
  const volume = computed(() => produtos.value.reduce((t, p) => t + p.quantidade, 0))
  const critico = computed(() => produtos.value.filter(p => p.quantidade < 5).length)

  return {
    produtos,
    historico,
    carregando,
    total,
    volume,
    critico,
    buscarDados,
    salvarProduto,
    registrarSaida,
    deletarProduto
  }
}