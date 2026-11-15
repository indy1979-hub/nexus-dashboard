import { createRoot, type Root } from "react-dom/client";
import { addCollection } from "@iconify/react";
import icons from "./icons.json";
import css from "./styles.css?inline";
import { App } from "./App";
import { ConfContext, type NexusConfig } from "./config";
import { setHass, type Hass } from "./ha";

// Benötigte Symbole sind eingebettet; weitere lädt Iconify bei Bedarf nach.
addCollection(icons as Parameters<typeof addCollection>[0]);

const VERSION = "1.0.0";

class NexusDashboardCard extends HTMLElement {
  private root?: Root;
  private config: NexusConfig = {};
  private hasHass = false;

  setConfig(config: NexusConfig) {
    this.config = config ?? {};
    this.render();
  }

  set hass(h: Hass) {
    setHass(h);
    if (!this.hasHass) {
      this.hasHass = true;
      this.render();
    }
  }

  getCardSize() {
    return 12;
  }

  getGridOptions() {
    return { columns: "full", rows: 12 };
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    if (!this.isConnected) return;
    if (!this.shadowRoot) {
      const sr = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = css;
      const mount = document.createElement("div");
      mount.className = "host";
      sr.append(style, mount);
      this.root = createRoot(mount);
    }
    if (!this.hasHass) {
      this.root!.render(<div className="loading">NEXUS · VERBINDE …</div>);
      return;
    }
    this.root!.render(
      <ConfContext.Provider value={this.config}>
        <App />
      </ConfContext.Provider>,
    );
  }
}

if (!customElements.get("nexus-dashboard")) {
  customElements.define("nexus-dashboard", NexusDashboardCard);
  const w = window as unknown as { customCards?: unknown[] };
  w.customCards = w.customCards ?? [];
  w.customCards.push({ type: "nexus-dashboard", name: "Nexus Dashboard", description: "Szenisches Vollbild-Dashboard mit Glas-Karten", preview: false });
  console.info(`%c NEXUS-DASHBOARD %c ${VERSION} `, "background:#0f766e;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px", "background:#134e4a;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px");
}
