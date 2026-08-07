const SENTINEL = "__ExportDiscordToSilverBullet";

function flash(msg) {
  var t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText =
    "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);" +
    "background:#1e1f22;color:#dbdee1;padding:10px 16px;border-radius:6px;" +
    "z-index:99999;box-shadow:0 4px 24px rgba(0,0,0,.4);font:14px system-ui;";
  document.body.appendChild(t);
  setTimeout(function() { t.remove(); }, 2500);
}

if (window[SENTINEL]) {
  if (location.pathname !== window[SENTINEL].path) {
    window[SENTINEL].cleanup();
  } else {
    flash("Selection mode already active.");
    return;
  }
}

function findFiber(node) {
  var key = Object.keys(node).find(function(k) { return k.startsWith("__reactFiber$"); });
  return key ? node[key] : null;
}
function walkFiber(node, predicate) {
  var fiber = findFiber(node);
  while (fiber) {
    var p = fiber.memoizedProps;
    if (p) {
      var hit = predicate(p);
      if (hit) return hit;
    }
    fiber = fiber.return;
  }
  return null;
}
function findMessageObj(node) {
  return walkFiber(node, function(p) { return (p.message && p.message.author) ? p.message : null; });
}
function findChannelObj(node) {
  return walkFiber(node, function(p) { return (p.channel && p.channel.id) ? p.channel : null; });
}
function findGuildObj(node) {
  return walkFiber(node, function(p) { return (p.guild && p.guild.id) ? p.guild : null; });
}

function getDmName(c) {
  var recips = c.recipients;
  if (!recips) return "";
  var handles = [];
  var items = Array.isArray(recips) ? recips : Object.values(recips);
  for (var ri = 0; ri < items.length; ri++) {
    var r = items[ri];
    if (!r || typeof r !== "object") continue;
    var h = r.username || r.global_name || r.globalName || r.name || "";
    if (h) handles.push(h);
  }
  return handles.length > 0 ? handles.join(", ") : "";
}

function extractChannel(li) {
  var c = findChannelObj(li);
  if (c) {
    var dmName = getDmName(c);
    if (dmName) return { id: String(c.id), name: dmName };
    if (c.name) return { id: String(c.id), name: c.name };
  }
  var parts = location.pathname.split("/");
  var id = c ? String(c.id) : (parts[3] || "");
  var name = getChannelNameFromDom(li);
  return { id: id, name: name };
}

function getChannelNameFromDom(li) {
  var aria = (li ? li.closest("section[aria-label]") : null) ||
             (function() {
               var m = document.querySelector("li[id^=\"chat-messages-\"]");
               return m ? m.closest("section[aria-label]") : null;
             })();
  if (aria) {
    var label = aria.getAttribute("aria-label") || "";
    if (label && !/^(User|Status|Settings|Servers|Members|Channels)/i.test(label)) {
      return label.replace(/^#/, "").trim();
    }
  }
  var title = document.title;
  title = title.replace(/ [\u2014|] Discord$/i, "");
  title = title.replace(/^Discord [\u2014|] /i, "");
  var sepIdx = title.search(/ [\u2014|] /);
  if (sepIdx > 0) title = title.substring(0, sepIdx);
  return title.replace(/^@/, "").trim();
}
function extractGuild(li) {
  var g = findGuildObj(li);
  if (g && g.id) {
    var icon = "";
    if (g.icon) {
      var ext = String(g.icon).startsWith("a_") ? "gif" : "webp";
      icon = "https://cdn.discordapp.com/icons/" + g.id + "/" + g.icon + "." + ext + "?size=1024";
    }
    return { id: String(g.id), name: g.name || "", icon: icon };
  }
  var parts = location.pathname.split("/");
  var idPart = parts[2] || "";
  if (idPart === "@me") return { id: "@me", name: "", icon: "" };
  var name = "";
  var guildHeader = document.querySelector("header[class*=\"header\"] h1, header[class*=\"header\"] [class*=\"name\"]");
  if (guildHeader) name = guildHeader.textContent.trim();
  return { id: idPart, name: name, icon: "" };
}

function avatarUrlFor(author) {
  if (!author) return "";
  if (author.avatar) {
    var ext = String(author.avatar).startsWith("a_") ? "gif" : "png";
    return "https://cdn.discordapp.com/avatars/" + author.id + "/" + author.avatar + "." + ext + "?size=128";
  }
  var slot = author.discriminator && author.discriminator !== "0"
    ? Number(author.discriminator) % 5
    : Number(BigInt(author.id || "0") >> 22n) % 6;
  return "https://cdn.discordapp.com/embed/avatars/" + slot + ".png";
}

function resolveTokens(raw, msgObj) {
  if (!raw) return "";
  var mentions = new Map();
  (msgObj.mentions || []).forEach(function(u) { mentions.set(u.id, u); });
  var channels = new Map();
  (msgObj.mentionChannels || msgObj.mention_channels || []).forEach(function(c) { channels.set(c.id, c); });
  return raw
    .replace(/<@!?(\d+)>/g, function(_, id) {
      var u = mentions.get(id);
      var name = u && (u.globalName || u.global_name || u.username);
      return "@" + (name || id);
    })
    .replace(/<#(\d+)>/g, function(m, id) {
      var c = channels.get(id);
      return c && c.name ? "#" + c.name : m;
    })
    .replace(/<a?:(\w+):\d+>/g, function(_, n) { return ":" + n + ":"; });
}

function cleanContent(raw) {
  var lines = raw.split("\n");
  var i = 0;
  while (i < lines.length) {
    if (lines[i].startsWith(">>> ")) {
      lines[i] = lines[i].replace(">>> ", "> ");
      i++;
      while (i < lines.length) {
        lines[i] = "> " + lines[i];
        i++;
      }
    } else {
      i++;
    }
  }
  return lines.join("\n");
}

function toIso(t) {
  if (!t) return "";
  if (t instanceof Date) return t.toISOString();
  if (typeof t === "object") {
    if (typeof t.toISOString === "function") return t.toISOString();
    if (typeof t.toDate === "function") return t.toDate().toISOString();
    if (typeof t.toString === "function") {
      var d = new Date(t.toString());
      if (!isNaN(d)) return d.toISOString();
    }
  }
  var d = new Date(t);
  return isNaN(d) ? String(t) : d.toISOString();
}

function yamlScalar(s) {
  if (s === null || s === undefined || s === "") return '""';
  s = String(s);
  if (/^-?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(s)) return JSON.stringify(s);
  if (/^[A-Za-z0-9_@.\/:?&=+#-]+$/.test(s) && !/^[-?!&*|>%@`]/.test(s)) {
    return s;
  }
  return JSON.stringify(s);
}
function yamlBlock(text, indent) {
  return text.split("\n").map(function(l) { return indent + l; }).join("\n");
}
function indentBlock(text, firstPrefix, restPrefix) {
  return text.split("\n")
    .map(function(l, i) { return (i === 0 ? firstPrefix : restPrefix) + l; })
    .join("\n");
}
function messageToYaml(m) {
  var lines = [];
  lines.push("author:");
  lines.push("  id: " + yamlScalar(m.authorId));
  lines.push("  handle: " + yamlScalar(m.handle));
  lines.push("  display: " + yamlScalar(m.display));
  lines.push("  avatar: " + yamlScalar(m.avatarUrl));
  lines.push("createdTimestamp: " + yamlScalar(m.createdTimestamp));
  if (m.editedTimestamp) {
    lines.push("editedTimestamp: " + yamlScalar(m.editedTimestamp));
  }
  lines.push("permalink: " + yamlScalar(m.permalink));
  if (m.content) {
    lines.push("content: |");
    lines.push(yamlBlock(m.content.replace(/\n+$/, ""), "  "));
  } else {
    lines.push('content: ""');
  }
  if (!m.attachments || m.attachments.length === 0) {
    lines.push("attachments: []");
  } else {
    lines.push("attachments:");
    for (var j = 0; j < m.attachments.length; j++) {
      lines.push("  - " + yamlScalar(m.attachments[j]));
    }
  }
  return lines.join("\n");
}
function buildBlock(channel, guild, messages) {
  var out = ["```#discord"];
  var isDm = !guild.id || guild.id === "@me" || guild.id === "0";
  out.push("channelId: " + yamlScalar(channel.id));
  out.push("channelName: " + yamlScalar(channel.name));
  if (!isDm) {
    out.push("serverId: " + yamlScalar(guild.id));
    out.push("serverName: " + yamlScalar(guild.name));
    if (guild.icon) {
      out.push("serverIcon: " + yamlScalar(guild.icon));
    }
  }
  out.push("messages:");
  for (var k = 0; k < messages.length; k++) {
    out.push(indentBlock(messageToYaml(messages[k]), "- ", "  "));
  }
  out.push("```");
  return out.join("\n") + "\n";
}

function extractMessage(li) {
  var msgObj = findMessageObj(li);
  if (!msgObj) {
    console.warn("[sb-export] no fiber message for", li);
    return null;
  }
  var a = msgObj.author || {};
  var parts = location.pathname.split("/");
  var permalink = parts.length >= 4
    ? "https://discord.com/channels/" + parts[2] + "/" + parts[3] + "/" + msgObj.id
    : "";
  return {
    messageId: msgObj.id || "",
    authorId: a.id || "",
    handle: a.username || "",
    display: a.globalName || a.global_name || a.username || "",
    avatarUrl: avatarUrlFor(a),
    createdTimestamp: toIso(msgObj.timestamp),
    editedTimestamp: toIso(msgObj.editedTimestamp || msgObj.edited_timestamp),
    permalink: permalink,
    content: resolveTokens(cleanContent(msgObj.content || ""), msgObj),
    attachments: (msgObj.attachments || []).map(function(att) { return att.url; }).filter(Boolean),
  };
}

var bar = document.createElement("div");
bar.id = "sb-export-bar";
bar.innerHTML =
  "<button id=\"sb-close\" class=\"close\">&#x2715;</button>" +
  "<span id=\"sb-count\">0 selected</span>" +
  "<button id=\"sb-export\">Export</button>";

var styleEl = document.createElement("style");
styleEl.id = "sb-export-bar-style";
styleEl.textContent =
  "#sb-export-bar{" +
  "display:flex;align-items:center;gap:8px;" +
  "height:48px;padding:0 8px;" +
  "background:var(--background-primary,#313338);" +
  "border-bottom:1px solid var(--background-modifier-accent,rgba(79,84,92,0.48));" +
  "color:var(--text-normal,#dbdee1);" +
  "font-family:var(--font-primary,\"gg sans\",\"Noto Sans\",\"Helvetica Neue\",Helvetica,Arial,sans-serif);" +
  "font-size:16px;line-height:1.4}" +
  "#sb-export-bar button{" +
  "background:none;border:0;border-radius:3px;cursor:pointer;padding:6px 12px;" +
  "color:var(--interactive-normal,#b5bac1);" +
  "font-family:inherit;font-size:14px;font-weight:500;line-height:1.2em}" +
  "#sb-export-bar button.close{" +
  "font-size:18px;padding:6px 10px;line-height:1}" +
  "#sb-export-bar button:hover{" +
  "background:var(--background-modifier-hover,rgba(79,84,92,0.16));" +
  "color:var(--interactive-hover,#dbdee1)}" +
  "#sb-export-bar button:active{" +
  "background:var(--background-modifier-active,rgba(79,84,92,0.24))}" +
  "#sb-export-bar #sb-count{" +
  "flex:1;font-weight:500;" +
  "white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
  "li[data-sb-selected]{" +
  "box-shadow:inset 4px 0 0 var(--brand-experiment,#5865f2)!important;" +
  "background:rgba(88,101,242,0.08)!important}";

document.head.appendChild(styleEl);

function mountBar() {
  var header = document.querySelector("[class*=\"subtitleContainer\"]");
  if (!header) header = document.querySelector("[class*=\"titleWrapper\"]");
  if (!header) header = document.querySelector("section[aria-label] > div[class*=\"header\"]");
  if (!header) header = document.querySelector("div[class*=\"chat\"] > section > div:first-child");
  if (!header) header = document.querySelector("div[class*=\"chat\"] section > div:first-child");
  if (header) {
    header.parentElement.insertBefore(bar, header.nextSibling);
    if (!header.id) header.id = "sb-orig-header";
    var hideRule = document.getElementById("sb-header-hide");
    if (!hideRule) {
      hideRule = document.createElement("style");
      hideRule.id = "sb-header-hide";
      hideRule.textContent = "#" + header.id + "{display:none!important}";
      document.head.appendChild(hideRule);
    }
    bar.style.cssText =
      "display:flex;align-items:center;gap:8px;" +
      "height:48px;padding:0 8px;box-sizing:border-box;" +
      "background:var(--background-primary,#313338);" +
      "border-bottom:1px solid var(--background-modifier-accent,rgba(79,84,92,0.48));" +
      "color:var(--text-normal,#dbdee1);" +
      "font-family:var(--font-primary,\"gg sans\",\"Noto Sans\",\"Helvetica Neue\",Helvetica,Arial,sans-serif);" +
      "font-size:16px;line-height:1.4";
    return;
  }
  fallbackMount();
}

function fallbackMount() {
  bar.style.cssText =
    "box-sizing:border-box;position:fixed;top:48px;left:240px;right:0;z-index:99999;" +
    "display:flex;align-items:center;gap:8px;height:48px;padding:0 8px;" +
    "background:var(--background-primary,#313338);" +
    "border-bottom:1px solid var(--background-modifier-accent,rgba(79,84,92,0.48));" +
    "color:var(--text-normal,#dbdee1);" +
    "font-family:var(--font-primary,\"gg sans\",\"Noto Sans\",\"Helvetica Neue\",Helvetica,Arial,sans-serif);" +
    "font-size:16px;line-height:1.4";
  document.body.appendChild(bar);
}
mountBar();

var initPath = location.pathname;
var pathRafId = null;
(function watchPath() {
  pathRafId = requestAnimationFrame(watchPath);
  if (location.pathname !== initPath) {
    cleanup();
  }
})();

var selected = new Set();
var updateCount = function() {
  bar.querySelector("#sb-count").textContent =
    selected.size + " selected";
};

function onClick(e) {
  if (e.target.closest("#sb-export-bar")) return;
  if (e.target.closest("a, button, [role=\"button\"]")) return;
  var li = e.target.closest("li[id^=\"chat-messages-\"]");
  if (!li) return;
  var msg = findMessageObj(li);
  if (!msg) return;
  if (msg.type !== undefined && msg.type !== 0 && msg.type !== 19) return;
  e.preventDefault();
  e.stopPropagation();
  if (selected.has(li)) {
    selected.delete(li);
    li.removeAttribute("data-sb-selected");
  } else {
    selected.add(li);
    li.setAttribute("data-sb-selected", "");
  }
  updateCount();
}
document.addEventListener("click", onClick, true);

function cleanup() {
  document.removeEventListener("click", onClick, true);
  if (pathRafId) { cancelAnimationFrame(pathRafId); pathRafId = null; }
  selected.forEach(function(li) { li.removeAttribute("data-sb-selected"); });
  selected.clear();
  bar.remove();
  styleEl.remove();
  var hideRule = document.getElementById("sb-header-hide");
  if (hideRule) hideRule.remove();
  delete window[SENTINEL];
}

bar.querySelector("#sb-export").addEventListener("click", function() {
  if (location.pathname !== initPath) { cleanup(); return; }
  if (selected.size === 0) { flash("No messages selected"); cleanup(); return; }
  var ordered = Array.from(selected).sort(function(a, b) {
    return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
  var channel = extractChannel(ordered[0]);
  var guild = extractGuild(ordered[0]);
  var messages = ordered.map(extractMessage).filter(function(m) { return m && m.messageId; });
  if (messages.length === 0) {
    flash("Couldn't read message data \u2014 Discord DOM may have changed");
    cleanup();
    return;
  }
  var text = buildBlock(channel, guild, messages);
  try {
    navigator.clipboard.writeText(text).then(function() {
      flash("Copied " + messages.length + " messages");
    }, function(err) {
      console.error("[sb-export] clipboard write failed:", err);
      console.log(text);
      flash("Clipboard blocked \u2014 block printed to console");
    });
  } catch (err) {
    console.error("[sb-export] clipboard write failed:", err);
    console.log(text);
    flash("Clipboard blocked \u2014 block printed to console");
  }
  cleanup();
});

bar.querySelector("#sb-close").addEventListener("click", function() { cleanup(); });

window[SENTINEL] = { cleanup: cleanup, path: initPath };
