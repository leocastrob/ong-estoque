<script setup lang="ts">
import { onMounted } from 'vue'
import { History, Loader2 } from 'lucide-vue-next'

// Importando o Composable
import { useEstoque } from './composables/useEstoque'

// Importando os Componentes
import DashboardCards from './components/DashboardCards.vue'
import PainelSaida from './components/PainelSaida.vue'
import FormEntrada from './components/FormEntrada.vue'
import TabelaEstoque from './components/TabelaEstoque.vue'

// Importando UI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Extraindo tudo do nosso Composable
const { 
  produtos, historico, carregando, 
  total, volume, critico, 
  buscarDados, salvarProduto, registrarSaida, deletarProduto 
} = useEstoque()

const formatarData = (data: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(data))
}

onMounted(buscarDados)
</script>

<template>
  <div class="min-h-screen bg-zinc-50 p-4 md:p-8 pb-20">
    <div class="max-w-6xl mx-auto space-y-6">
      
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-zinc-900 tracking-tight">📦 Gestão de Doações</h1>
          <p class="text-zinc-500 font-medium">Controle de Estoque Profissional</p>
        </div>
        <div v-if="carregando" class="flex items-center gap-2 text-zinc-400">
          <Loader2 class="w-4 h-4 animate-spin" />
          <span class="text-xs">Sincronizando...</span>
        </div>
      </header>

      <DashboardCards :total="total" :volume="volume" :critico="critico" />

      <PainelSaida :produtos="produtos" @registrarSaida="registrarSaida" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FormEntrada @salvar="salvarProduto" />
        <TabelaEstoque :produtos="produtos" @deletar="deletarProduto" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="text-lg flex items-center gap-2">
            <History class="w-5 h-5 text-zinc-500" /> Histórico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader class="bg-zinc-50">
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead class="text-right">Quantidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="mov in historico" :key="mov.id">
                  <TableCell class="text-xs text-zinc-500">{{ formatarData(mov.data) }}</TableCell>
                  <TableCell class="font-medium">{{ mov.produto?.nome }}</TableCell>
                  <TableCell class="text-right font-bold text-red-600">- {{ mov.quantidade }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
    </div>
  </div>
</template>