/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React, useEffect, useRef, useState } from "@webpack/common";

import { SearchTrack, SpotifyStore } from "./SpotifyStore";

export function MusicSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [tracks, setTracks] = useState<SearchTrack[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [failedTrack, setFailedTrack] = useState<SearchTrack | null>(null);
    const generation = useRef(0);

    useEffect(() => {
        if (!open) return;
        const term = query.trim();
        const request = ++generation.current;
        setTracks([]);
        setTotal(0);
        setError("");
        setFailedTrack(null);
        if (term.length < 2) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const timeout = setTimeout(async () => {
            try {
                const result = await SpotifyStore.searchTracks(term);
                if (generation.current !== request) return;
                setTracks(result.items);
                setTotal(result.total);
            } catch (cause) {
                if (generation.current === request) setError(cause instanceof Error ? cause.message : "Não foi possível buscar músicas.");
            } finally {
                if (generation.current === request) setLoading(false);
            }
        }, 350);

        return () => {
            clearTimeout(timeout);
            generation.current++;
        };
    }, [query, open]);

    async function loadMore() {
        if (loading || tracks.length >= total || !query.trim()) return;
        const request = generation.current;
        setLoading(true);
        try {
            const result = await SpotifyStore.searchTracks(query.trim(), tracks.length);
            if (generation.current !== request) return;
            setTracks(previous => [...previous, ...result.items.filter(track => !previous.some(item => item.id === track.id))]);
            setTotal(result.total);
        } catch (cause) {
            if (generation.current === request) setError(cause instanceof Error ? cause.message : "Não foi possível carregar mais músicas.");
        } finally {
            if (generation.current === request) setLoading(false);
        }
    }

    function onScroll(event: React.UIEvent<HTMLDivElement>) {
        const list = event.currentTarget;
        if (list.scrollTop + list.clientHeight >= list.scrollHeight - 24) void loadMore();
    }

    async function chooseTrack(track: SearchTrack) {
        setError("");
        setFailedTrack(null);
        try {
            await SpotifyStore.playTrack(track.uri);
            setOpen(false);
        } catch (cause) {
            setFailedTrack(track);
            setError(cause instanceof Error ? cause.message : "O Spotify não conseguiu iniciar essa música. Verifique o dispositivo e a conta Premium.");
        }
    }

    return (
        <div className="vc-spotify-search">
            <button
                type="button"
                className="vc-spotify-search-toggle"
                aria-label={open ? "Fechar busca de músicas" : "Buscar música"}
                aria-expanded={open}
                title={open ? "Fechar busca" : "Buscar música"}
                onClick={() => setOpen(value => !value)}
            >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                    <path d="m15.8 8.2-2.5 5.1-5.1 2.5 2.5-5.1 5.1-2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
            </button>
            {open && <div className="vc-spotify-search-panel">
                <input
                    type="search"
                    aria-label="Nome da música ou artista"
                    placeholder="Música ou artista..."
                    value={query}
                    onChange={event => setQuery(event.currentTarget.value)}
                    autoFocus
                />
                {tracks.length > 0 && <div className="vc-spotify-search-results" onScroll={onScroll} role="list" aria-label="Resultados da busca">
                    {tracks.map(track => <div role="listitem" key={track.id}>
                        <button type="button" onClick={() => void chooseTrack(track)}>
                            {track.album?.images?.[0]?.url && <img src={track.album.images[0].url} alt="" loading="lazy" />}
                            <span className="vc-spotify-search-copy"><strong>{track.name}</strong><small>{track.artists.map(artist => artist.name).join(", ")}</small></span>
                        </button>
                    </div>)}
                </div>}
                <div className={`vc-spotify-search-status${error ? " vc-spotify-search-error" : ""}`} role={error ? "alert" : "status"} aria-live="polite">
                    {error || (loading ? "Buscando..." : query.trim().length < 2 ? "Digite pelo menos duas letras." : tracks.length === 0 ? "Nenhuma música encontrada." : tracks.length < total ? "Desça para ver mais." : "")}
                </div>
                {failedTrack && <button
                    type="button"
                    className="vc-spotify-search-external"
                    onClick={() => SpotifyStore.openExternal(`/track/${failedTrack.id}`)}
                >Abrir esta música no Spotify para apertar Play</button>}
                {error && !failedTrack && query.trim().length >= 2 && <button
                    type="button"
                    className="vc-spotify-search-external"
                    onClick={() => SpotifyStore.openExternal(`/search/${encodeURIComponent(query.trim())}`)}
                >Abrir busca no Spotify</button>}
            </div>}
        </div>
    );
}
