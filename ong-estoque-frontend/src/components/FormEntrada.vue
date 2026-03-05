<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const emit = defineEmits(['salvar'])

const form = ref({
  nome: '',
  categoria: '',
  quantidade: '',
  validade: ''
})

const enviar = () => {
  // Envia os dados para o App.vue e limpa o formulário
  emit('salvar', { ...form.value })
  form.value = { nome: '', categoria: '', quantidade: '', validade: '' }
}
</script>

<template>
  <Card class="h-fit">
    <CardHeader>
      <CardTitle class="text-lg">Nova Entrada</CardTitle>
      <CardDescription>Cadastre um novo item no estoque.</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="enviar" class="space-y-4">
        <div class="space-y-2">
          <Label>Nome do Item</Label>
          <Input v-model="form.nome" placeholder="Ex: Arroz 5kg" required />
        </div>
        <div class="space-y-2">
          <Label>Categoria</Label>
          <Input v-model="form.categoria" placeholder="Ex: Alimentos" required />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Quantidade</Label>
            <Input type="number" v-model="form.quantidade" placeholder="0" required />
          </div>
          <div class="space-y-2">
            <Label>Validade</Label>
            <Input type="date" v-model="form.validade" />
          </div>
        </div>
        <Button type="submit" class="w-full">Cadastrar Doação</Button>
      </form>
    </CardContent>
  </Card>
</template>