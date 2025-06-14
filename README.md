# 🕶️ Passus: Visão Aumentada para Independência

## 🚀 Visão Geral do Projeto

**Passus** é um projeto revolucionário que visa transformar a vida de pessoas cegas e com baixa visão, proporcionando-lhes uma nova forma de interagir com o mundo ao seu redor. Através de um sistema inovador de óculos inteligentes, alimentado por Inteligência Artificial, **Passus** oferece orientação em tempo real, eliminando a necessidade de guias tradicionais e promovendo uma independência e dignidade sem precedentes na locomoção e percepção do ambiente.

Mais do que uma ferramenta de assistência, **Passus** é um facilitador de autonomia, permitindo que o usuário explore o mundo com confiança e segurança, redescobrindo sua capacidade de ir e vir livremente.

## ✨ Características Principais

* **Navegação Guiada por IA:** Orientação de rota e detecção de obstáculos em tempo real.
* **Descrição Detalhada do Ambiente:** Identificação e descrição verbal de objetos, pessoas e cenários.
* **Leitura de Texto Instantânea:** Reconhecimento Óptico de Caracteres (OCR) para ler placas, rótulos e documentos.
* **Reconhecimento Facial:** Identificação de indivíduos próximos para facilitar interações sociais.
* **Integração Intuitiva:** Design discreto e natural dos óculos, com comunicação por voz clara e audível.
* **Renovação da Dignidade e Independência:** Capacita o usuário a viver de forma mais autônoma e confiante.

## ⚙️ Tecnologias Envolvidas

Este projeto integra hardware e software de ponta para entregar uma experiência fluida e eficaz.

### Hardware (Conceitual para os Óculos)

* **Câmeras de Alta Definição:** Para captura de imagem de qualidade superior do ambiente.
* **Microprocessadores Embarcados:** Para processamento de IA e gestão do sistema em tempo real.

### Software e IA

* **Inteligência Artificial (IA) & Machine Learning:** A base para todas as capacidades de percepção e tomada de decisão.
* **Processamento de IA:** Otimizado para execução eficiente no dispositivo ou via cloud.
* **Reconhecimento Óptico de Caracteres (OCR):** Para extração de texto de imagens.
* **Reconhecimento de Objetos:** Identificação de diversos itens no ambiente.
* **Reconhecimento Facial:** Para identificar faces humanas.
* **Descrição de Cena:** Geração de descrições textuais ricas do ambiente visual.
* **Text-to-Speech (TTS):** Conversão das descrições e informações para áudio claro e natural.

### Web e Backend

* **Next.js 15:** Framework React para construção da interface web, que pode atuar como um painel de controle, configuração ou até mesmo um simulador/demonstrador das capacidades do óculos.
* **API do Google Gemini:** Utilizada como o motor principal de Inteligência Artificial para a descrição de imagens e interações complexas. A interface web envia as imagens (capturadas conceitualmente pelos óculos) para a API do Gemini.

## 💡 Como Funciona (Fluxo de Alto Nível)

1.  **Captura Visual:** As câmeras de alta definição nos óculos capturam o ambiente em tempo real.
2.  **Envio para Processamento (Web/API):** As imagens são enviadas (através de uma interface, simulando a comunicação do hardware do óculos) para a API do Google Gemini.
3.  **Análise por IA:** O modelo Gemini processa as imagens, utilizando suas capacidades de reconhecimento de objetos, faces, OCR e descrição de cena.
4.  **Geração de Informação:** A IA gera descrições detalhadas e contextuais do que está à frente do usuário.
5.  **Feedback Auditivo:** As informações são convertidas em fala via Text-to-Speech e transmitidas ao usuário através de microfones nos óculos (ou fones de ouvido integrados).
6.  **Orientação em Tempo Real:** Com base na análise, o sistema fornece instruções claras para a navegação e alertas sobre obstáculos.

## 💻 Configuração e Execução (Exemplo para a Parte Web)

Para configurar e rodar a parte web do projeto (Next.js + integração com Gemini API), siga os passos abaixo:

### Pré-requisitos

* Node.js (versão 18 ou superior recomendada)
* npm ou yarn
* Uma chave de API do Google Gemini

### 1. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <nome-do-seu-repositorio>
