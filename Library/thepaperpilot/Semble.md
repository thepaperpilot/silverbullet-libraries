---
tags: meta/library
---
# Semble collection panel

Add a collection to any page's YAML frontmatter:

```yaml
---
sembleCollection: https://semble.so/profile/your.handle/collections/record-key
---
```

And that page will have a new panel appear that shows all the items listed in that collection.

The property also accepts an `at://…/network.cosmik.collection/…` URI or a Semble
collection UUID. A URL's last segment is an AT record key, not a collection UUID.

If Semble later requires authentication (e.g. when private data lands), add this to your configuration page:

```lua
config.set("semble.apiKey", "YOUR_SEMBLE_API_KEY")
```

Optional configuration:

```lua
-- Use a different frontmatter property (including a key containing spaces).
config.set("semble.collectionProperty", "sembleCollection")
-- Cache successful results for this many seconds; 0 disables caching.
config.set("semble.cacheSeconds", 60)
```

The panel updates on page navigation and frontmatter edits. Run **Semble: Refresh
Collection** to bypass the cache after changing a collection in Semble. If you
close the panel, **Navigate: Semble Collection** opens it again.

## Implementation

```space-lua
local cache = {}

-- Remote metadata is plain text, not executable page expressions or Markdown.
local function plainText(value)
  local text = tostring(value or "")
  text = string.gsub(text, "%s+", " ")
  text = string.gsub(text, "&", "&amp;")
  text = string.gsub(text, "<", "&lt;")
  text = string.gsub(text, ">", "&gt;")
  return string.gsub(text, "([\\`*_{}%[%]()#+%.!|$~%-])", "\\%1")
end

local function htmlAttribute(value)
  value = string.gsub(value, "&", "&amp;")
  value = string.gsub(value, '"', "&quot;")
  value = string.gsub(value, "<", "&lt;")
  return string.gsub(value, ">", "&gt;")
end

local function htmlText(value)
  local text = string.gsub(tostring(value or ""), "%s+", " ")
  -- Prevent remote text from introducing SilverBullet page expressions.
  return string.gsub(htmlAttribute(text), "%$", "&#36;")
end

local function collectionRequest(value)
  if type(value) ~= "string" or string.match(value, "^%s*$") then
    error("The collection property must be a Semble URL, AT URI, or collection UUID.")
  end
  value = string.match(value, "^%s*(.-)%s*$")
  local handle, recordKey = string.match(value,
    "^https://semble%.so/profile/([^/]+)/collections/([^/?#]+)")
  if not handle then
    handle, recordKey = string.match(value,
      "^at://([^/]+)/network%.cosmik%.collection/([^/?#]+)$")
  end
  if handle then
    return "network.cosmik.collection.getByAtUri?handle="
      .. js.window.encodeURIComponent(js.window.decodeURIComponent(handle))
      .. "&recordKey="
      .. js.window.encodeURIComponent(js.window.decodeURIComponent(recordKey))
  end
  if #value == 36 and string.match(value,
    "^%x%x%x%x%x%x%x%x%-%x%x%x%x%-%x%x%x%x%-%x%x%x%x%-%x%x%x%x%x%x%x%x%x%x%x%x$") then
    return "network.cosmik.collection.get?collectionId=" .. value
  end
  error("Use a Semble collection URL, AT URI, or collection UUID.")
end

local function fetchCollection(value)
  local request = collectionRequest(value)
  local apiKey = config.get("semble.apiKey", "")
  local ttl = tonumber(config.get("semble.cacheSeconds", 60)) or 60
  local showImages = config.get("semble.showImages", true)
  local imageWidth = math.floor(tonumber(config.get("semble.imageWidth", 240)) or 240)
  imageWidth = math.max(32, math.min(1200, imageWidth))
  local cached = cache[request]
  if cached and cached.apiKey == apiKey and cached.showImages == showImages
    and cached.imageWidth == imageWidth and os.time() - cached.time < ttl then
    return cached.markdown
  end

  local headers = { Accept = "application/json" }
  if apiKey ~= "" then headers["X-API-Key"] = apiKey end
  local lines, seen = {}, {}
  local page = 1
  while true do
    local response = net.proxyFetch("https://api.semble.so/xrpc/" .. request
      .. "&page=" .. page .. "&limit=100&sortBy=createdAt&sortOrder=desc", {
      headers = headers,
      responseEncoding = "application/json",
    })
    if not response.ok or response.status ~= 200 then
      error("Semble returned HTTP " .. tostring(response.status)
        .. ". Check the collection and semble.apiKey setting.")
    end
    local body = response.body
    if type(body) ~= "table" or type(body.urlCards) ~= "table"
      or type(body.pagination) ~= "table"
      or type(body.pagination.hasMore) ~= "boolean" then
      error("Semble returned an unexpected collection response.")
    end
    if body.pagination.currentPage and body.pagination.currentPage ~= page then
      error("Semble returned an unexpected page number.")
    end
    for _, card in ipairs(body.urlCards) do
      local metadata = card.cardContent or {}
      local url = card.url or metadata.url
      if type(url) == "string" and string.match(url, "^https?://") and not seen[url] then
        seen[url] = true
        -- Angle-delimited destinations allow parentheses in article URLs.
        local destination = string.gsub(url, "[%s<>\\]", function(char)
          return js.window.encodeURIComponent(char)
        end)
        local title = metadata.title
        if title == nil or title == "" then title = url end
        local line = "**[" .. plainText(title) .. "](<" .. destination .. ">)**"
        if metadata.description and metadata.description ~= "" then
          line = line .. "\n\n" .. plainText(metadata.description)
        end
        if showImages and type(metadata.imageUrl) == "string" and metadata.imageUrl ~= "" then
          local imageOk, imageUrl = pcall(function()
            return js.new(js.window.URL, metadata.imageUrl, url).href
          end)
          if imageOk and string.match(imageUrl, "^https?://") then
            -- Use a flex row so the thumbnail never shares a text line box.
            local text = '<div style="flex:1;min-width:0;overflow-wrap:anywhere">'
              .. '<a href="' .. htmlAttribute(url) .. '" target="_blank" rel="noopener noreferrer">'
              .. '<strong>' .. htmlText(title) .. '</strong></a>'
            if metadata.description and metadata.description ~= "" then
              text = text .. '<div style="margin-top:0.25em">'
                .. htmlText(metadata.description) .. '</div>'
            end
            text = text .. '</div>'
            line = '<div style="display:flex;align-items:flex-start;gap:1em;margin:0.5em 0">'
              .. text
              .. '<a href="' .. htmlAttribute(url) .. '" target="_blank" rel="noopener noreferrer"'
              .. ' style="display:block;flex:0 0 auto;width:' .. imageWidth .. 'px;max-width:35%">'
              .. '<img src="' .. htmlAttribute(imageUrl) .. '" alt="Link preview" loading="lazy"'
              .. ' style="display:block;width:100%;height:auto;border-radius:6px">'
              .. '</a></div>'
          end
        end
        table.insert(lines, line)
      end
    end
    if not body.pagination.hasMore then break end
    if #body.urlCards == 0 or page >= 1000 then
      error("Semble pagination did not finish; refresh the collection to try again.")
    end
    page = page + 1
  end

  local md = #lines > 0 and table.concat(lines, "\n\n") or "This collection has no links."
  cache[request] = {
    apiKey = apiKey, showImages = showImages, imageWidth = imageWidth,
    time = os.time(), markdown = md,
  }
  return md
end

view.define {
  name = "semble.collection",
  title = "Semble Collection",
  command = "Navigate: Semble Collection",
  dock = "page-bottom",
  supportedDocks = { "page-top", "page-bottom", "lhs", "rhs", "bhs", "modal" },
  defaultOpen = true,
  refreshOn = {
    "editor:pageLoaded", "editor:documentLoaded", "editor:pageModified",
    "semble:refreshCollection",
  },
  refreshOnOpen = true,
  content = function()
    if not string.match(editor.getCurrentPath(), "%.md$") then return "" end
    local ok, result = pcall(function()
      local fm = index.extractFrontmatter(editor.getText()).frontmatter or {}
      local value = fm[config.get("semble.collectionProperty", "sembleCollection")]
      if value == nil then return "" end
      return fetchCollection(value)
    end)
    if not ok then return "Could not load the collection: " .. plainText(result) end
    return result
  end,
}

command.define {
  name = "Semble: Refresh Collection",
  run = function()
    cache = {}
    event.dispatch("semble:refreshCollection")
  end,
}
```