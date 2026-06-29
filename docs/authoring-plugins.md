# Build a plugin

A plugin is a single `*.plugin.js` file that the BetterCodex client loads. It exports a `start`/`stop` lifecycle and gets a small API (`BdApi`) for styling, storage, and notifications — the same shape BetterDiscord plugin authors know.

> **How plugins run.** Codex's renderer is sandboxed with a strict content‑security policy, so BetterCodex loads plugins through its managed runtime and exposes a small `BdApi` surface. Keep plugins to the documented API; anything that needs deeper access should be a [skill](authoring-skills.md). All plugins are reviewed before merge.

## File format

```js
/**
 * @name StatusRibbon
 * @author yourhandle
 * @version 1.0.0
 * @description Shows the current model and branch in a slim ribbon.
 */

module.exports = class StatusRibbon {
  start() {
    BdApi.DOM.addStyle("status-ribbon", `
      .status-ribbon { position: fixed; bottom: 0; left: 0; right: 0;
        height: 22px; font: 12px var(--font-sans);
        background: var(--color-token-bg-secondary); }
    `);
    this.node = document.createElement("div");
    this.node.className = "status-ribbon";
    document.body.appendChild(this.node);
  }

  stop() {
    BdApi.DOM.removeStyle("status-ribbon");
    this.node?.remove();
  }
};
```

A plugin must export `start()` and `stop()`. `stop()` has to fully undo `start()` so the plugin can be toggled cleanly.

## The `BdApi` surface

| API | Use |
|-----|-----|
| `BdApi.DOM.addStyle(id, css)` / `removeStyle(id)` | Inject and remove CSS |
| `BdApi.Data.load(key)` / `save(key, value)` | Persist plugin settings |
| `BdApi.UI.showToast(message)` | Notify the user |
| `BdApi.Patcher.before/after/instead(id, obj, method, fn)` | Wrap a function |
| `BdApi.Plugins.getAll()` / `BdApi.Themes.getAll()` | Inspect installed addons |

See the full reference: [plugin-api.md](plugin-api.md).

## Test and submit

Drop the file in `~/.codex/bettercodex/plugins/`, enable it in BetterCodex → **Plugins**, then add it to the registry and open a PR (see [CONTRIBUTING.md](../CONTRIBUTING.md)):

```
addons/plugins/status-ribbon/
  manifest.json        # type: "plugin", file: "status-ribbon.plugin.js"
  status-ribbon.plugin.js
```
