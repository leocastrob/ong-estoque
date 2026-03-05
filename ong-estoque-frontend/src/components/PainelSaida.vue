<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDownRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

defineProps<{ produtos: any[] }>()
const emit = defineEmits(['registrarSaida'])

const formSaida = ref({
  produtoId: '',
  quantidade: ''
})

const confirmar = () => {
  emit('registrarSaida', { ...formSaida.value })
  formSaida.value = { produtoId: '', quantidade: '' }
}
</script>

<template>
  <Card class="bg-zinc-900 text-zinc-50 border-none shadow-xl">
    <CardHeader>
      <CardTitle class="flex items-center gap-2 text-lg">
        <ArrowDownRight class="w-5 h-5 text-red-400" />
        Registrar Entrega de Doação
      </CardTitle>
      <CardDescription class="text-zinc-400">
        Dê baixa nos itens entregues às famílias.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="confirmar" class="flex flex-col md:flex-row gap-4 items-end">
        <div class="space-y-2 w-full md:w-2/5">
          <Label class="text-zinc-400">Produto</Label>
          <Select v-model="formSaida.produtoId">
            <SelectTrigger class="bg-zinc-800 border-zinc-700 text-zinc-100">
              <SelectValue placeholder="Selecione o item..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="p in produtos" :key="p.id" :value="p.id">
                  {{ p.nome }} (Disponível: {{ p.quantidade }})
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="space-y-2 w-full md:w-1/5">
          <Label class="text-zinc-400">Qtd. Saída</Label>
          <Input 
            type="number" 
            v-model="formSaida.quantidade" 
            class="bg-zinc-800 border-zinc-700 text-zinc-100" 
            placeholder="0" 
            min="1" 
            required
          />
        </div>
        <Button type="submit" variant="destructive" class="w-full md:w-1/5 font-bold uppercase tracking-wider">
          Baixar Estoque
        </Button>
      </form>
    </CardContent>
  </Card>
</template>