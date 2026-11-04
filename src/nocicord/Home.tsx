/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// NociCord settings home, 2026 NociCord contributors.

import "./home.css";

import { useSettings } from "@api/Settings";

const profiles = [
    { id: "essential", title: "Essencial", detail: "Menos espaço e menos movimento.", compact: true, reducedMotion: true },
    { id: "balanced", title: "Equilibrado", detail: "Leitura confortável para todo dia.", compact: false, reducedMotion: false },
    { id: "expressive", title: "Expressivo", detail: "Mais presença para as cores e o nome.", compact: false, reducedMotion: false }
] as const;

const accents = [
    { id: "rose", title: "Vinho", color: "#b66b8b" },
    { id: "violet", title: "Lilás", color: "#9b82f6" },
    { id: "cyan", title: "Gelo", color: "#72c9d2" }
] as const;

export function NociCordHome() {
    const { nocicord } = useSettings(["nocicord.*"]);

    function setProfile(profile: typeof profiles[number]) {
        nocicord.profile = profile.id;
        nocicord.compact = profile.compact;
        nocicord.reducedMotion = profile.reducedMotion;
    }

    return (
        <div className="vc-nocicord-home">
            <header className="vc-nocicord-masthead">
                <img className="vc-nocicord-mark" src="vesktop://static/secord-logo.png" alt="" />
                <div className="vc-nocicord-title-block">
                    <h1>SeCord</h1>
                    <p className="vc-nocicord-subtitle">(SoulEater)</p>
                </div>
                <div className="vc-nocicord-edition">edição pessoal<br />2026</div>
            </header>

            <div className="vc-nocicord-layout">
                <section className="vc-nocicord-module vc-nocicord-profiles">
                    <div className="vc-nocicord-module-title"><h2>Ritmo</h2></div>
                    <p>Escolha como esta interface se apresenta. O perfil Essencial reduz efeitos visuais, sem prometer ganho de FPS.</p>
                    <div className="vc-nocicord-profile-list" role="group" aria-label="Perfil visual">
                        {profiles.map(profile => (
                            <button
                                key={profile.id}
                                type="button"
                                className="vc-nocicord-profile"
                                aria-pressed={nocicord.profile === profile.id}
                                onClick={() => setProfile(profile)}
                            >
                                <span className="vc-nocicord-profile-indicator" aria-hidden="true" />
                                <span className="vc-nocicord-profile-copy"><strong>{profile.title}</strong><small>{profile.detail}</small></span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="vc-nocicord-module vc-nocicord-personalize">
                    <div className="vc-nocicord-module-title"><h2>Identidade</h2></div>
                    <p>Mude a cor de destaque e ajuste os detalhes sem editar arquivos.</p>
                    <div className="vc-nocicord-color-list" role="group" aria-label="Cor de destaque">
                        {accents.map(accent => (
                            <button
                                key={accent.id}
                                type="button"
                                className="vc-nocicord-color"
                                aria-pressed={nocicord.accent === accent.id}
                                onClick={() => (nocicord.accent = accent.id)}
                            >
                                <span className="vc-nocicord-swatch" style={{ backgroundColor: accent.color }} aria-hidden="true" />
                                {accent.title}
                            </button>
                        ))}
                    </div>
                    <div className="vc-nocicord-switches">
                        <button
                            type="button"
                            className="vc-nocicord-toggle"
                            role="switch"
                            aria-checked={nocicord.compact}
                            onClick={() => {
                                nocicord.compact = !nocicord.compact;
                                nocicord.profile = "custom";
                            }}
                        >
                            <span>Mais compacto<small>Reduz o espaço do painel.</small></span>
                            <span className="vc-nocicord-toggle-track" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            className="vc-nocicord-toggle"
                            role="switch"
                            aria-checked={nocicord.reducedMotion}
                            onClick={() => {
                                nocicord.reducedMotion = !nocicord.reducedMotion;
                                nocicord.profile = "custom";
                            }}
                        >
                            <span>Menos movimento<small>Reduz animações no painel.</small></span>
                            <span className="vc-nocicord-toggle-track" aria-hidden="true" />
                        </button>
                    </div>
                </section>
            </div>

            <section className="vc-nocicord-voice">
                <div className="vc-nocicord-module-title"><h2>Por onde começar</h2></div>
                <div className="vc-nocicord-voice-grid">
                    <p><strong>MessageLogger</strong><br />Marca em vermelho mensagens apagadas que já passaram pelo seu SeCord. O registro é temporário.</p>
                    <p><strong>FakeNitro</strong><br />Emojis e figurinhas de outros servidores podem ser enviados como links ou imagens quando o canal permitir. Não concede Nitro.</p>
                    <p><strong>Decor e FakeProfileThemes</strong><br />Personalizam sua aparência. Alguns efeitos aparecem só para você ou para quem usa a mesma extensão.</p>
                </div>
            </section>

            <section className="vc-nocicord-voice">
                <div className="vc-nocicord-module-title"><h2>Voz e tela</h2></div>
                <div className="vc-nocicord-voice-grid">
                    <p><strong>Microfone mutado</strong><br />Você deixa de falar e continua ouvindo. Server mute também mantém a escuta.</p>
                    <p><strong>Server deafen</strong><br />Bloqueia a escuta até que alguém com permissão remova o estado.</p>
                    <p><strong>Compartilhar tela</strong><br />Precisa da permissão do canal e da sua autorização de captura.</p>
                </div>
            </section>

            <footer className="vc-nocicord-credit">Criado sobre o código aberto do Vencord. Créditos e licença no arquivo README.</footer>
        </div>
    );
}
