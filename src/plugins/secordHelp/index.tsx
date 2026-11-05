/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChatBarButton, ChatBarButtonFactory } from "@api/ChatButtons";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { Modal, openModal } from "@webpack/common";

const help = [
    ["Abrir transmissão SeCord", "Ctrl + Alt + S", "Abre a janela de transmissão própria. Escolha a tela e inicie por lá."],
    ["Abrir clipes de áudio", "Ctrl + Alt + C", "Abre a janela de clipes no Windows."],
    ["Reiniciar o SeCord", "Ctrl + Shift + R", "Reabre o aplicativo."],
    ["Abrir o SeCord", "Menu Iniciar", "Procure por SeCord e pressione Enter. Não há atalho global para abrir o app fechado."],
    ["Spotify pausando na chamada", "SeCord → Spotify na chamada", "Ative Evitar pausa do Spotify e reinicie com Ctrl + Shift + R. A opção bloqueia a pausa iniciada pelo cliente. Se a música continuar parando, use Aperte para falar ou ajuste a sensibilidade do microfone em Voz e vídeo."],
];

const HelpButton: ChatBarButtonFactory = ({ isAnyChat }) => {
    if (!isAnyChat) return null;
    return <ChatBarButton tooltip="Ajuda e atalhos do SeCord" onClick={() => openModal(props =>
        <Modal {...props} size="md" title="Ajuda e atalhos do SeCord">
            <div style={{ padding: "12px 22px 22px", display: "grid", gap: 16 }}>
                {help.map(([title, keys, detail]) => <section key={title}>
                    <strong>{title}</strong>
                    <div style={{ marginTop: 5 }}><kbd>{keys}</kbd></div>
                    <p style={{ margin: "6px 0 0", opacity: .75, lineHeight: 1.45 }}>{detail}</p>
                </section>)}
                <p style={{ margin: 0, opacity: .7 }}>Os atalhos de transmissão e clipes controlam funções do SeCord. O compartilhamento normal do Discord depende das permissões do canal e da disponibilidade na região.</p>
            </div>
        </Modal>
    )} buttonProps={{ "aria-haspopup": "dialog" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-1.2 1.1-1.8 1.4-1.8 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>
    </ChatBarButton>;
};

export default definePlugin({
    name: "SeCordHelp",
    description: "Ajuda em português para as funções e atalhos do SeCord",
    authors: [Devs.SoulEater],
    enabledByDefault: true,
    chatBarButton: { icon: () => null, render: HelpButton }
});
