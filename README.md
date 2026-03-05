# 📦 Sistema de Gestão de Estoque - ONG

Este é um sistema Full Stack desenvolvido para facilitar o controle de entrada e saída de mantimentos em ONGs. O projeto utiliza uma arquitetura moderna para garantir agilidade, segurança e uma interface amigável para os voluntários.

## 🚀 Tecnologias Utilizadas

### Frontend
* **Vue.js 3** (Composition API)
* **Vite** (Build tool rápida)
* **Tailwind CSS** (Estilização)
* **Shadcn/UI** (Componentes de interface profissionais)
* **Lucide Vue** (Ícones)

### Backend
* **Node.js** com **TypeScript**
* **Fastify** (Framework de alto desempenho)
* **Prisma ORM** (Gestão de banco de dados)
* **SQLite** (Banco de dados local e ágil)

---

## 🛠️ Funcionalidades Principais

* **Upsert Inteligente:** Ao registrar a entrada de um item, o sistema verifica se ele já existe (mesmo nome e unidade). Se existir, soma a quantidade; se não, cria um novo registro.
* **Gestão de Saídas:** Painel intuitivo para dar baixa em itens do estoque.
* **Dashboard Visual:** Cards com resumo de itens totais e categorias.
* **Filtro em Tempo Real:** Tabela de estoque com busca instantânea.
* **Design Responsivo:** Adaptado para uso em computadores e tablets.

---

⚙️ Como Executar

1. Backend
``` 
Bash
cd ong-estoque-backend
npm install
npx prisma migrate dev --name init
npm run dev
```
2. Frontend
```
Bash
cd ong-estoque-frontend
npm install
npm run dev
```

📝 Licença
Este projeto foi desenvolvido para fins educacionais e de apoio social. Sinta-se à vontade para contribuir!

Desenvolvido por Leonardo Castro

