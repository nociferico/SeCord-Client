# SeCord (SoulEater)

SeCord é uma edição local e configurável baseada no [Vencord](https://github.com/Vendicated/Vencord). Esta versão apresenta um painel próprio, perfis visuais, cores de destaque e controles de aparência que podem ser alterados sem reinstalar.

Leia [NOCICORD.md](NOCICORD.md) para ver recursos, limites de voz e compartilhamento, compilação e reversão.

## Compilação

Requer Node.js 22+ e pnpm.

```powershell
pnpm install --frozen-lockfile
pnpm build:nocicord
```

Os arquivos do cliente ficam em `dist`. O compilador desativa o atualizador automático do Vencord para proteger a versão personalizada. O aplicativo separado está em [SeCord Desktop](https://github.com/nociferico/SeCord-Desktop); ele incorpora estes arquivos sem instalar nada no Discord original.

## Créditos e licença

Base: Vencord 1.15.16, commit `383409e6a6ec9008ee8a7496500f1e75f17824d1`. Os direitos dos autores originais são preservados. O código continua sob [GPL-3.0-or-later](LICENSE). SeCord não é afiliado ao Discord nem à equipe do Vencord.
