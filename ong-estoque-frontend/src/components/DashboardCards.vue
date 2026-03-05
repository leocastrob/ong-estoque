<script setup lang="ts">
import { Package, Layers, AlertTriangle } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

defineProps<{
  total: number,
  volume: number,
  critico: number
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <Card class="border-l-4 border-l-blue-500 shadow-sm">
      <CardHeader class="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle class="text-xs font-bold uppercase text-zinc-500">Total de Itens</CardTitle>
        <Package class="w-4 h-4 text-zinc-400" />
      </CardHeader>
      <CardContent><div class="text-2xl font-bold">{{ total }}</div></CardContent>
    </Card>

    <Card class="border-l-4 border-l-emerald-500 shadow-sm">
      <CardHeader class="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle class="text-xs font-bold uppercase text-zinc-500">Volume Total</CardTitle>
        <Layers class="w-4 h-4 text-zinc-400" />
      </CardHeader>
      <CardContent><div class="text-2xl font-bold">{{ volume }}</div></CardContent>
    </Card>

    <Card class="border-l-4 border-l-red-500 shadow-sm">
      <CardHeader class="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle class="text-xs font-bold uppercase text-zinc-500">Estoque Crítico</CardTitle>
        <AlertTriangle class="w-4 h-4 text-red-500" />
      </CardHeader>
      <CardContent><div class="text-2xl font-bold text-red-600">{{ critico }}</div></CardContent>
    </Card>
  </div>
</template>