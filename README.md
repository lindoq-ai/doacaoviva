# 💙 DoaçãoViva

> **Conectando doadores a pessoas em situação de vulnerabilidade — diretamente, sem intermediários, via Pix.**

O **DoaçãoViva** é uma plataforma social que elimina a distância entre quem quer ajudar e quem precisa de ajuda imediata. Através de uma interface moderna e "glassmorphism", o sistema permite que pessoas contem suas histórias e recebam doações diretamente em suas contas via Pix.

## ✨ Funcionalidades

- 📱 **Rede Social de Impacto**: Perfis individuais onde histórias reais são contadas.
- 💸 **Doação Direta (Zero Taxas)**: O Pix vai direto para o receptor. A plataforma não retém valores.
- 🏳️🌈 **Inclusão e Respeito**: Categorias específicas para causas LGBT+ e apoio a minorias.
- ⚖️ **Conformidade Legal**: Compromisso com a segurança e o combate à discriminação, em conformidade com as leis de proteção e criminalização da LGBTfobia.
- 📊 **Dashboard de Impacto**: Doadores podem acompanhar o total doado e as causas apoiadas.
- 🔒 **Segurança**: Integração com Firebase Auth e Firestore com regras de segurança rigorosas.
- 🎨 **Design Moderno**: Interface construída com Tailwind CSS usando estética "Glassmorphism".

## 🛠️ Stack Técnica

- **Frontend**: React (Vite) + TypeScript
- **Backend**: Express (Proxy para desenvolvimento)
- **Database/Auth**: Firebase (Firestore & Authentication)
- **Estilização**: Tailwind CSS v4 + Framer Motion (animações)
- **Componentes**: shadcn/ui

## 🚀 Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/doacaoviva.git
   cd doacaoviva
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o Firebase:**
   - Crie um projeto gratuito no [Console do Firebase](https://console.firebase.google.com/).
   - Ative a **Autenticação (Google)** e o **Firestore Database**.
   - Crie um arquivo `firebase-applet-config.json` na raiz com suas credenciais:
     ```json
     {
       "apiKey": "SUA_API_KEY",
       "authDomain": "SEU_PROJETO.firebaseapp.com",
       "projectId": "SEU_PROJETO",
       "storageBucket": "SEU_PROJETO.appspot.com",
       "messagingSenderId": "SEU_ID",
       "appId": "SEU_APP_ID",
       "firestoreDatabaseId": "(default)"
     }
     ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

---

## 👨‍💻 Autor

**Lindomar** — Estudante de Engenharia de Software.
Projeto desenvolvido como portfólio para demonstrar habilidades em Full-stack, Firebase e Design de Interface.

## 📄 Licença
Distribuído sob a licença MIT.
