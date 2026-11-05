/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import translations from "./ptBRTranslations.json";

const reviewed: Record<string, string> = {
    "Show channels that you do not have access to view.": "Mostra na lista os canais ocultos que o Discord enviar ao aplicativo. Ao abrir, mostra apenas uma prévia; não libera mensagens, conversa nem entrada na voz.",
    "Hide Unreads": "Ocultar marca de não lidas nos canais ocultos",
    "The mode used to display hidden channels.": "Aparência dos canais ocultos na lista.",
    "Plain style with Lock Icon instead": "Normal, com ícone de cadeado",
    "Muted style with hidden eye icon on the right": "Discreto, com ícone de olho oculto",
    "Whether the allowed users and roles dropdown on hidden channels should be open by default": "Mostrar por padrão os usuários e cargos autorizados na prévia do canal.",
    "Temporarily logs deleted and edited messages.": "Marca em vermelho mensagens apagadas que o SeCord já recebeu e mostra edições. Pode guardar até 500 mensagens apagadas por 30 dias neste computador; não recupera mensagens nunca carregadas.",
    "The style of deleted messages": "Como destacar mensagens apagadas.",
    "Red text": "Texto vermelho",
    "Red overlay": "Fundo vermelho",
    "Show a compact music search above the Spotify player": "Mostra uma bússola de busca acima do player. Exibe três músicas por vez e permite rolar para ver mais.",
    "Adds a Spotify player above the account panel": "Mostra o player do Spotify acima da sua conta, com busca compacta de músicas quando o Spotify está conectado e tocando.",
    "Allows you to send fake emojis/stickers, use nitro themes, and stream in nitro quality": "Envia emojis e figurinhas como links ou imagens quando possível; libera temas só na sua tela e tenta opções extras de transmissão. Não concede Nitro nem permissões do servidor.",
    "Allows sending fake emojis (also bypasses missing permission to use custom emojis)": "Envia emojis como links ou imagens quando o canal permitir. Não libera a permissão de emoji externo do servidor.",
    "Allows sending fake stickers (also bypasses missing permission to use stickers)": "Envia figurinhas como links ou imagens quando o canal permitir. Não libera a permissão de figurinha externa do servidor.",
    "Allow streaming in nitro quality": "Tenta oferecer opções maiores de qualidade de transmissão; o resultado depende do Discord e da sua conexão.",
    "Whether to disable the embed permission check when sending fake emojis and stickers": "Ignora a verificação local de incorporação. Se o canal bloquear links, o resultado pode falhar ou aparecer apenas como URL.",
    "Whether to transform fake emojis into real ones": "Mostra os links de emoji deste recurso como emojis na sua própria tela.",
    "Whether to transform fake stickers into real ones": "Mostra os links de figurinha deste recurso como figurinhas na sua própria tela."
};

const tags: Record<string, string> = {
    Accessibility: "Acessibilidade", Activity: "Atividade", Appearance: "Aparência", Chat: "Conversa",
    Commands: "Comandos", Console: "Console", Customisation: "Personalização", Developers: "Desenvolvimento",
    Emotes: "Emojis", Friends: "Amigos", Fun: "Diversão", Media: "Mídia", Notifications: "Notificações",
    Organisation: "Organização", Privacy: "Privacidade", Reactions: "Reações", Roles: "Cargos",
    Servers: "Servidores", Shortcuts: "Atalhos", Utility: "Utilitários", Voice: "Voz"
};

export function ptBR(value?: string): string {
    if (!value) return "";
    return reviewed[value] ?? tags[value] ?? (translations as Record<string, string>)[value] ?? value;
}
