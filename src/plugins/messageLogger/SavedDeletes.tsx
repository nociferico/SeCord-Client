/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as DataStore from "@api/DataStore";
import { Button } from "@components/Button";
import { useEffect, useState } from "@webpack/common";

const KEY = "SeCord_MessageLogger_Deleted_v1";
const MAX_ITEMS = 500;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export interface SavedDelete {
    id: string;
    channelId: string;
    author: string;
    content: string;
    deletedAt: number;
}

function recent(items: unknown): SavedDelete[] {
    if (!Array.isArray(items)) return [];
    const cutoff = Date.now() - MAX_AGE_MS;
    return items.filter((item): item is SavedDelete =>
        !!item && typeof item.id === "string" && typeof item.channelId === "string" &&
        typeof item.content === "string" && typeof item.deletedAt === "number" && item.deletedAt >= cutoff
    ).slice(-MAX_ITEMS);
}

export async function saveDeletedMessage(message: any) {
    if (typeof message?.id !== "string" || typeof message?.channel_id !== "string") return;
    const entry: SavedDelete = {
        id: message.id,
        channelId: message.channel_id,
        author: String(message.author?.globalName || message.author?.username || message.author?.id || "Desconhecido").slice(0, 100),
        content: String(message.content || (message.attachments?.length ? "[anexo removido]" : "[sem texto]")).slice(0, 4000),
        deletedAt: Date.now()
    };
    await DataStore.update<SavedDelete[]>(KEY, items => [...recent(items).filter(item => item.channelId !== entry.channelId || item.id !== entry.id), entry].slice(-MAX_ITEMS));
}

export async function removeSavedDelete(channelId: string, id: string) {
    await DataStore.update<SavedDelete[]>(KEY, items => recent(items).filter(item => item.channelId !== channelId || item.id !== id));
}

export function SavedDeletes() {
    const [items, setItems] = useState<SavedDelete[]>([]);
    const [error, setError] = useState("");

    const refresh = () => DataStore.get<SavedDelete[]>(KEY)
        .then(value => { setItems(recent(value).toReversed()); setError(""); })
        .catch(() => setError("Não foi possível ler o registro local."));

    useEffect(() => { void refresh(); }, []);

    const clear = () => DataStore.del(KEY)
        .then(() => { setItems([]); setError(""); })
        .catch(() => setError("Não foi possível limpar o registro."));

    return (
        <div className="secord-saved-deletes">
            <p>Mensagens apagadas recebidas por este SeCord nos últimos 30 dias. Até 500 registros ficam guardados neste computador. A conversa marca em vermelho apenas as mensagens carregadas na sessão atual.</p>
            <div className="secord-saved-deletes-actions">
                <Button onClick={() => void refresh()}>Atualizar registro</Button>
                <Button onClick={() => void clear()} disabled={!items.length}>Apagar registro</Button>
            </div>
            {error && <p role="alert">{error}</p>}
            <div className="secord-saved-deletes-list">
                {items.length ? items.map(item => (
                    <div className="secord-saved-deletes-item" key={`${item.channelId}-${item.id}`}>
                        <div><strong>{item.author}</strong><span>{new Date(item.deletedAt).toLocaleString("pt-BR")}</span></div>
                        <p>{item.content}</p>
                        <small>Canal {item.channelId}</small>
                    </div>
                )) : <p>Nenhuma mensagem apagada registrada.</p>}
            </div>
        </div>
    );
}
