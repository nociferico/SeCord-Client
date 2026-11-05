# SeCord

Este repositório contém o cliente modificado usado pelo [SeCord Desktop](https://github.com/nociferico/SeCord-Desktop). O aplicativo Windows é instalado à parte e não altera os arquivos do Discord original.

## No aplicativo

- A tela de extensões tem descrições em português, favoritos e uma seleção de opções úteis.
- A barra de mensagem deixa emoji e Apps à vista; a seta abre as demais ferramentas.
- O botão de ajuda explica os atalhos do SeCord em português.
- Em **SeCord → Spotify na chamada**, você pode ativar a opção que impede a rotina local de pausa do Discord. É preciso reiniciar após mudar. Ela não controla pausas feitas pelo Spotify em outro dispositivo.
- A decoração de avatar criada durante os testes foi removida. O SeCord não inclui essa imagem nem a aplica ao perfil.

A busca do Spotify depende de conta, dispositivo ativo e permissões de reprodução. Tradução, registro de mensagens apagadas e outras extensões dependem dos dados que o Discord entrega ao cliente. Consulte o [README do aplicativo](https://github.com/nociferico/SeCord-Desktop#readme) para os limites e os testes de cada recurso.

## Base e licença

O cliente deriva do [Vencord](https://github.com/Vendicated/Vencord) 1.15.16, commit `383409e6a6ec9008ee8a7496500f1e75f17824d1`. Os créditos e avisos dos autores originais permanecem no código. A licença é [GPL-3.0-or-later](LICENSE). SeCord não é afiliado ao Discord ou à equipe do Vencord.

Para compilar, use Node.js 22 ou superior e pnpm:

```powershell
pnpm install --frozen-lockfile
pnpm build:nocicord
```
