# React Modular - Documentação

Uma aplicação web moderna construída com **React 19**, **TypeScript** e **Vite**, seguindo uma arquitetura modular bem organizada para melhor manutenibilidade e escalabilidade.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Estrutura Modular](#estrutura-modular)
- [Bibliotecas Utilizadas](#bibliotecas-utilizadas)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)

---

## 📌 Sobre o Projeto

Este projeto é uma aplicação web modular que segue boas práticas de organização de código, separando funcionalidades em módulos independentes e reutilizáveis. A arquitetura foi projetada para permitir crescimento e manutenção fácil da base de código.

---

## 🏗️ Estrutura Modular

A aplicação está organizada seguindo o padrão **Feature-based Module Structure**:

### Diretórios Principais

```
src/
├── core/                      # Funcionalidades centrais compartilhadas
│   ├── configs/              # Configurações (Report.ts, Result.ts)
│   ├── hooks/                # Custom hooks (useAuth.ts)
│   ├── shared/
│   │   ├── components/       # Componentes reutilizáveis (Footer, Header, Image)
│   │   └── utils/            # Utilitários compartilhados (validadores, schemas)
│   └── themes/               # Configurações de temas
│
├── modules/                  # Módulos de funcionalidades específicas
│   ├── auth/                 # Módulo de autenticação (AuthProvider)
│   ├── empresa-terceirizada/ # Módulo de gestão de empresas terceirizadas
│   ├── gestao-conhecimento/  # Módulo de gestão de conhecimento
│   ├── gestao-integrada/     # Módulo de gestão integrada
│   │   └── views/
│   │       └── equipes/      # Views de gerenciamento de equipes
│   └── home/                 # Módulo home
│       └── views/
│           └── Home.tsx      # View principal
│
├── routes/                   # Configuração de rotas
│   ├── AppRoutes.tsx        # Definição de rotas da aplicação
│   ├── ProtectedRoute.tsx   # Componente para rotas protegidas
│   ├── RestrictedRoute.tsx  # Componente para rotas restritas
│   └── Routes.tsx           # Provedor de rotas
│
├── service/                 # Serviços de API
│   ├── instanceApi.ts       # Instância do axios configurada
│   ├── mainApi.ts           # APIs principais
│   └── serviceApi.ts        # Serviços da API
│
├── assets/                  # Recursos estáticos
│   ├── images/              # Imagens
│   └── svg/                 # Ícones SVG
│
└── main.tsx                 # Ponto de entrada da aplicação
```

### Padrão Arquitetural

- **Core**: Contém utilitários, componentes base e configurações compartilhadas
- **Modules**: Cada módulo é independente e pode conter suas próprias rotas, componentes e lógica
- **Routes**: Gerencia navegação e controle de acesso (autenticação e restrições)
- **Service**: Camada de integração com APIs externas

---

## 📚 Bibliotecas Utilizadas

### Dependências de Produção

| Biblioteca                         | Versão  | Descrição                                                          |
| ---------------------------------- | ------- | ------------------------------------------------------------------ |
| **react**                          | ^19.2.0 | Biblioteca principal para construção de interfaces com componentes |
| **react-dom**                      | ^19.2.0 | Integração do React com o DOM                                      |
| **typescript**                     | ~5.9.3  | Tipagem estática para JavaScript                                   |
| **react-router-dom**               | ^7.12.0 | Roteamento e navegação entre páginas                               |
| **react-hook-form**                | ^7.71.1 | Gerenciamento de formulários com performance otimizada             |
| **@hookform/resolvers**            | ^5.2.2  | Integradores de validação para react-hook-form                     |
| **zod**                            | ^4.3.5  | Schema validation e type inference                                 |
| **axios**                          | ^1.13.2 | Cliente HTTP para requisições à API                                |
| **tailwindcss**                    | ^4.1.18 | Framework CSS utilitário para estilização                          |
| **@tailwindcss/vite**              | ^4.1.18 | Integração do Tailwind com Vite                                    |
| **clsx**                           | ^2.1.1  | Utilitário para concatenar classes CSS condicionalmente            |
| **@fortawesome/react-fontawesome** | ^3.1.1  | Ícones Font Awesome em React                                       |

### Dependências de Desenvolvimento

| Biblioteca               | Versão   | Descrição                               |
| ------------------------ | -------- | --------------------------------------- |
| **vite**                 | ^7.2.4   | Build tool e dev server rápido          |
| **@vitejs/plugin-react** | ^5.1.1   | Plugin React para Vite com Fast Refresh |
| **eslint**               | ^9.39.1  | Linter para JavaScript/TypeScript       |
| **@types/react**         | ^19.2.5  | Tipos TypeScript para React             |
| **@types/react-dom**     | ^19.2.3  | Tipos TypeScript para React DOM         |
| **@types/node**          | ^24.10.1 | Tipos TypeScript para Node.js           |

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn como gerenciador de pacotes

### Instalação

1. **Clone o repositório** (se aplicável):

```bash
git clone <url-do-repositorio>
cd workspace
```

2. **Instale as dependências**:

```bash
npm install
```

ou com yarn:

```bash
yarn install
```

### Executar em Desenvolvimento

Para iniciar o servidor de desenvolvimento com Hot Module Replacement (HMR):

```bash
npm run dev
```

ou com yarn:

```bash
yarn dev
```

A aplicação estará disponível em `http://localhost:5173` (porta padrão do Vite).

### Build para Produção

Para compilar a aplicação para produção:

```bash
npm run build
```

Isto executará:

1. Compilação TypeScript (`tsc -b`)
2. Build otimizado com Vite

O resultado estará na pasta `dist/`.

### Preview da Build

Para visualizar a build de produção localmente:

```bash
npm run preview
```

---

## 🔧 Scripts Disponíveis

| Comando           | Descrição                                               |
| ----------------- | ------------------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento com HMR            |
| `npm run build`   | Compila TypeScript e cria build otimizada para produção |
| `npm run lint`    | Executa validação de código com ESLint                  |
| `npm run preview` | Visualiza a build de produção localmente                |

---

## 📝 Configurações Importantes

- **tsconfig.json**: Configuração TypeScript
- **vite.config.ts**: Configuração Vite com plugins React e Tailwind
- **tailwind.config.js**: Configuração Tailwind CSS
- **eslint.config.js**: Configuração ESLint para análise de código

---

## 🎯 Próximos Passos

- Implementar autenticação completa no módulo `auth`
- Expandir os módulos de funcionalidades conforme necessário
- Adicionar testes unitários e de integração
- Configurar CI/CD para deploy automático
