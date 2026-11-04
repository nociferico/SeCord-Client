# NociCord

NociCord é uma versão local personalizada do Vencord. O código original continua creditado e licenciado sob GPL-3.0-or-later. Este projeto não é afiliado ao Discord nem à equipe do Vencord.
Modificações do cliente contrariam os termos de serviço do Discord, conforme informado pelo próprio Vencord.

## O que esta primeira versão traz

- Painel NociCord com monograma, tipografia e organização próprios.
- Perfis visuais Essencial, Equilibrado e Expressivo.
- Cor de destaque em violeta, rosa ou ciano.
- Controles independentes de densidade e movimento no painel.
- Explicações claras sobre mute, server deafen e compartilhamento.
- Compilação própria com o atualizador automático do Vencord desativado.

Os perfis são escolhas de **aparência**, não limites de CPU, qualidade de vídeo ou garantias de FPS. O modo Essencial reduz efeitos visuais no painel. As opções de compartilhamento que o Vencord oferece dependem da plataforma; a permissão do servidor e a autorização de captura continuam obrigatórias.

## Compilar

Requer Node.js 22 ou mais recente e pnpm. Na pasta do projeto:

```powershell
pnpm install --frozen-lockfile
pnpm build:nocicord
```

O resultado fica em `dist`. O executável oficial `VencordInstaller.exe` baixa a publicação oficial do Vencord quando usado normalmente; ele não instala esta compilação por conta própria. Para instalar a compilação local no Discord desktop, use o fluxo de desenvolvimento do projeto (`pnpm inject`) somente depois de fechar o Discord e fazer backup das configurações. `pnpm uninject` reverte a injeção. A instalação não foi executada durante a criação do NociCord.

## Limites de voz

Mutar o próprio microfone ou receber server mute impede transmitir voz e normalmente mantém a escuta. Server deafen bloqueia a escuta até que seja removido por alguém com permissão. NociCord não altera permissões do servidor nem mascara o estado de voz para terceiros.

## Base e manutenção

Base inicial: Vendicated/Vencord 1.15.16, commit `383409e6a6ec9008ee8a7496500f1e75f17824d1`. O Discord muda frequentemente; plugins e patches devem ser verificados após atualizações. O projeto mantém a licença e os avisos de copyright dos arquivos herdados.
Os testes de compilação, tipos e estilo passaram. A interface ainda precisa de uma verificação manual dentro do Discord antes de uso diário.
