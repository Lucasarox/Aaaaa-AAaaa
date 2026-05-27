# VemVans - Transporte Inteligente de Passageiros 🚐💨

O **VemVans** é uma aplicação completa e moderna projetada para otimizar o transporte em vans (escolar, universitário, executivo ou fretamento). Ele resolve de forma elegante os problemas mais comuns de comunicação entre motoristas e passageiros, reduzindo atrasos e promovendo segurança e privacidade.

Esta aplicação foi desenvolvida e integrada com serviços em nuvem seguros para evitar a exposição pública de chaves de API restritas (como Google Maps e Firebase).

---

## ✨ Funcionalidades Principais

### 👤 Perfil do Motorista (Driver)
*   **Gerenciamento de Rotas Dinâmicas:** Controle de múltiplos trajetos com passageiros auto-gerenciáveis.
*   **Seletor de Status e Ordem de Embarque:** Visualização e definição da fila de embarque/busca ordenada sem expor dados pessoais sensíveis dos membros.
*   **Compartilhamento de GPS em Tempo Real:** Transmissão de localização ativa apenas durante a viagem (evitando invasão de privacidade fora do horário).
*   **Alerta de Lotação Máxima:** Sistema inteligente que avisa caso o número de passageiros confirmados exceda a capacidade da van.

### 👥 Perfil do Passageiro (Passenger)
*   **Chamada por Votação Diária:** Opções de status rápidas: *“Vou”*, *“Não vou”*, *“Só ida”* e *“Só volta”*.
*   **Rastreamento Preciso em Tempo Real:** Visualização do mapa com a localização exata da van somente quando a viagem estiver ativa.
*   **Notificações Baseadas em Fila:** Alertas automatizados como *"Você é o próximo da fila!"* ou baseados em tempo estimado ("A van chega em X minutos").

---

## 🔒 Segurança de Chaves de API (Segurança DevOps)

Para evitar vazamentos de chaves de API do Google Cloud/Firebase e alertas no GitHub, o projeto foi reestruturado para utilizar **variáveis de ambiente no client-side via Vite** (`import.meta.env`).

### Como configurar as variáveis no ambiente de produção (GitHub Secrets / Vercel / Cloud Run):

Adicione as seguintes chaves de ambiente na plataforma onde você irá realizar o deploy (Ex: Vercel, Netlify, Cloud Run ou Configuração de Ambiente do Github):

```env
VITE_FIREBASE_API_KEY=sua_chave_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=id-do-seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_FIRESTORE_DATABASE_ID=nome-do-banco-firestore

# Chave do Google Maps Platform para o tracking em tempo real:
VITE_GOOGLE_MAPS_API_KEY=sua_chave_do_google_maps_aqui
```

> ⚠️ **IMPORTANTE:** O arquivo `firebase-applet-config.json` foi adicionado ao seu `.gitignore` e não deve ser commitado para garantir que nenhuma credencial local fique pública na internet.

---

## 🚀 Como Iniciar o Projeto Localmente

### 1. Instalar as dependências:
```bash
npm install
```

### 2. Executar o servidor de desenvolvimento:
```bash
npm run dev
```

### 3. Buildar para produção:
```bash
npm run build
```

---

## 🗺️ Integração Técnica do Mapa
O mapa usa o pacote `@googlemaps/js-api-loader` para carregar as APIs de forma assíncrona com performance acelerada, cache otimizado e balanceamento no consumo de dados de rede do celular dos passageiros e do motorista.
