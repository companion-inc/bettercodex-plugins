/**
 * @name Hello Codex
 * @version 1.0.0
 * @description Adds a small BetterCodex launcher button that proves plugins can render UI, show toasts, and persist local state.
 * @author BetterCodex
 */
module.exports = class HelloCodex {
  start() {
    this.count = Number(BdApi.Data.load("clicks") || 0);
    BdApi.DOM.addStyle("hello-codex", `
      .bettercodex-hello-button {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 2147483000;
        display: flex;
        align-items: center;
        gap: 8px;
        height: 34px;
        padding: 0 12px;
        border: 1px solid var(--color-token-border-default, rgba(255,255,255,.16));
        border-radius: 12px;
        background: var(--color-token-main-surface-primary, #171717);
        color: var(--color-token-foreground, #f4f4f5);
        font: 500 13px/18px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        box-shadow: 0 12px 34px rgba(0,0,0,.28);
        cursor: pointer;
      }
      .bettercodex-hello-button:hover {
        background: var(--color-token-list-hover-background, rgba(255,255,255,.08));
      }
    `);
    this.node = document.createElement("button");
    this.node.type = "button";
    this.node.className = "bettercodex-hello-button";
    this.node.textContent = this.label();
    this.node.addEventListener("click", this.onClick);
    document.body.appendChild(this.node);
    BdApi.UI.showToast("Hello Codex enabled");
  }

  stop() {
    this.node?.removeEventListener("click", this.onClick);
    this.node?.remove();
    BdApi.DOM.removeStyle("hello-codex");
  }

  onClick = () => {
    this.count += 1;
    BdApi.Data.save("clicks", this.count);
    this.node.textContent = this.label();
    BdApi.UI.showToast(`Hello from BetterCodex (${this.count})`);
  };

  label() {
    return this.count ? `BetterCodex ${this.count}` : "BetterCodex";
  }
};
