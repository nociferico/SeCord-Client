/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// NociCord appearance layer, 2026 NociCord contributors.

import { Settings, SettingsStore } from "@api/Settings";
import { userStyleRootNode } from "@api/Styles";
import { createAndAppendStyle } from "@utils/css";

const accents = {
    violet: ["#9b82f6", "#6f55c8"],
    rose: ["#b66b8b", "#8d4d6d"],
    cyan: ["#72c9d2", "#358c9d"]
} as const;

let style: HTMLStyleElement;

function updateAppearance() {
    const { accent, compact, profile, reducedMotion } = Settings.nocicord;
    const [primary, dark] = accents[accent] ?? accents.violet;
    style ??= createAndAppendStyle("nocicord-appearance", userStyleRootNode);

    style.textContent = `
        :root {
            --nocicord-accent: ${primary};
            --nocicord-accent-dark: ${dark};
            --brand-500: ${primary};
            --brand-560: ${dark};
        }
        ${compact ? `
            .vc-nocicord-masthead { min-height: 112px; padding: 18px 24px; }
            .vc-nocicord-module { padding: 18px 24px; }
            .vc-nocicord-profile { padding: 9px 4px; }
        ` : ""}
        ${profile === "expressive" ? `
            .vc-nocicord-mark {
                box-shadow: 10px 10px 0 color-mix(in srgb, ${primary} 22%, transparent);
            }
            .vc-nocicord-profile[aria-pressed="true"] {
                background: color-mix(in srgb, ${primary} 14%, transparent);
            }
        ` : ""}
        ${reducedMotion ? `
            .vc-settings-tab *, .vc-settings-tab *::before, .vc-settings-tab *::after {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        ` : ""}
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    updateAppearance();
    SettingsStore.addPrefixChangeListener("nocicord", updateAppearance);
}, { once: true });
