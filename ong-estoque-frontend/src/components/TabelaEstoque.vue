<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Trash2 } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const props = defineProps<{ produtos: any[] }>()
const emit = defineEmits(['deletar'])

const filtro = ref('')

const produtosFiltrados = computed(() => {
  const termo = filtro.value.toLowerCase()
  return props.produtos.filter(p => 
    p.nome.toLowerCase().includes(termo) || 
    p.categoria.toLowerCase().includes(termo)
  )
})
</script>

<template>
  <Card class="lg:col-span-2">
    <CardHeader class="pb-3 flex flex-row items-center justify-between">
      <CardTitle class="text-lg">Estoque Disponível</CardTitle>
      <div class="relative w-full max-w-xs ml-4">
        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
        <Input v-model="filtro" placeholder="Buscar item..." class="pl-9" />
      </div>
    </CardHeader>
    <CardContent>
      <div class="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader class="bg-zinc-50">
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead class="text-right">Qtd.</TableHead>
              <TableHead class="text-center w-[80px]">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="p in produtosFiltrados" :key="p.id">
              <TableCell class="font-semibold">{{ p.nome }}</TableCell>
              <TableCell class="text-right" :class="p.quantidade < 5 ? 'text-red-600 font-bold' : ''">
                {{ p.quantidade }} un.
              </TableCell>
              <TableCell class="text-center">
                <Button variant="ghost" size="icon" @click="emit('deletar', p.id)">
                  <Trash2 class="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</template>