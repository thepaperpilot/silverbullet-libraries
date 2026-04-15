---
name: "Library/thepaperpilot/Campfire"
tags: meta/library
files:
- Campfire/Miniflux.md
- Campfire/Wallabag.md
- Campfire/Grafana.md
- Campfire/Twitch.md
---
Campfire is a library for showing rows of buttons that represent ongoing discussions or other events, without unread counts or backlogs that make keeping up with things seem like a chore. Partially inspired by the campfire idea proposed in Terry Godier’s [Phatom Obligation](https://www.terrygodier.com/phantom-obligation).

The data will be saved to a page so widgets can be re-rendered without making new network requests each time. It’s currently set to ${widget.html(dom.a { class = "sb-wiki-link", href = config.get("campfire.dataPage"), config.get("campfire.dataPage") })} but you can override it by setting a config like this:

```space-lua
-- priority: 50
config.set("campfire.dataPage", "Data/Campfire")
```

> **note** Note
> Rather than editing the code block above, consider copying it to another page, such as [[CONFIG]], and lowering the priority. That way your changes won’t be overwritten if/when you update this library.

To actually render the rows of buttons, you’ll need to query the items and show only the rows with items in them. To help, we use `campfire.rows()` with a list of rows and queries for each. There’s also a util for getting your `campfire-item`s with a specified tag, like so:

```lua
campfire.rows({
  ["Videos"] = campfire.get_items_by_tag("video")
})
```

Or the more robust util `campfire.get_items` which takes an anonymous function that receives each item and returns true if and only if it should be included.

## Data sources

To use campfire, you need data sources. Fetching data uses the [Service](https://silverbullet.md/API/service) API, meaning you simply need to define a service with the `campfire-refresh` selector that returns campfire items, like so:

```lua
service.define {
  selector = "campfire-refresh",
  match = {},
  run = function()
    local items = {}
    table.insert(items, {
      description = "Required",
      href = "Required",
      title = "Optional",
      image = "Optional",
      tags = { "Optional" },
      class = "Optional",
      onClick = "Optional; property of function in campfire.clickListeners",
      actions = { "Optional", "Properties of items in campfire.actions"}
    })
    return items
  end
}
```

> **note** Note
> As you can verify in the implementation below, the match property of the server essentially does not matter. We invoke every service with the `campfire-refresh` selector.

Campfire items can also define additional buttons. The buttons will need to be defined as well. You'll come up with an id for each action that must be globally unique (so something like “rss-markAsRead” instead of just “markAsRead”) and add its config to `campfire.actions`, like so:

```lua
campfire.actions["exampleAction"] = {
  label = "Required",
  onClick = function() {
    -- required
  }
}
```

Individual campfire items can then specify the actions to show with a list of the IDs, like: `actions: { "exampleAction" }`

If you need to make a campfire item do something when the main button is pressed, you can set the item’s onClick to a string identifier of the callback to call, and then set `campfire.clickListeners[id]` to the function. The function will be passed the campfire item being clicked.

I've created a handful of integrations for services I personally use:

TODO

## Refreshing data

Now that campfire knows how to fetch the data, it needs to know when to do it. The easiest way is to manually run the following commands, either by copying these buttons or via the command prompt (or via the action buttons menu or inside the onclick function on specific items, and so on).

${widgets.commandButton("Campfire: Refresh")} ${widgets.commandButton("Campfire: Refresh & Re-Render")}

For something more automatic, you can set the `campfire.autoRefresh` config like so (note this is just `lua`, not `space-lua`):

```lua
config.set("campfire.autoRefresh", 5)
```

## Implementation

```space-lua
-- priority: 50
campfire = {
  actions = {},
  clickListeners = {}
}
```

```space-lua
-- priority: 20

-- Returns a new table containing the items in t shuffled
-- https://gist.github.com/Uradamus/10323382?permalink_comment_id=3149506#gistcomment-3149506
function campfire.shuffled(t)
  local tbl = {}
  for i = 1, #t do
    tbl[i] = t[i]
  end
  for i = #tbl, 2, -1 do
    local j = math.random(i)
    tbl[i], tbl[j] = tbl[j], tbl[i]
  end
  return tbl
end

function campfire.create_button(item)
  local mainSection = {}
  if item.title then
    table.insert(mainSection, dom.h1 {
      class = "title",
      item.title
    })
  end

  local contentRow = {}
  if item.image then
    table.insert(contentRow, dom.img {
      class = "image",
      src = item.image
    })
  end
  table.insert(contentRow, dom.div {
    class = "description",
    item.description
  })
  table.insert(mainSection, dom.div {
    class = "content",
    table.unpack(contentRow)
  })
  
  local children = {}
  table.insert(children, dom.a {
    class = "main-section",
    href = item.href,
    target = "_blank",
    onclick = function()
      if item.onClick and campfire.clickListeners[item.onClick] then
        campfire.clickListeners[item.onClick](item)
      end
    end,
    table.unpack(mainSection)
  })

  if item.actions and #item.actions > 0 then
    local actions = {}
    for i, actionId in ipairs(item.actions) do
      if campfire.actions[actionId] ~= nil then
        local action = campfire.actions[actionId]
        table.insert(actions, dom.button {
          class = "action",
          onclick = function()
            action.onClick(item)
          end,
          action.label
        })
      end
    end
    table.insert(children, dom.div {
      class = "actions",
      table.unpack(actions)
    })
  end
  
  return dom.div {
    class = "button " .. (item.class or ""),
    table.unpack(children)
  }
end

function campfire.rows(rowsOfItems)
  local rows = {}
  for title, items in pairs(rowsOfItems) do
    if #items ~= 0 then
      table.insert(rows, dom.h2 { title })
      local row = {}
      for i, item in ipairs(items) do
        table.insert(row, campfire.create_button(item))
      end
      table.insert(rows, dom.div {
        class = "row",
        table.unpack(row)
      })
    end
  end
  if #rows == 0 then
    return widget.html(dom.i {
      class = "empty",
      "The campfire is empty"
    })
  end
  return widget.html(dom.div {
    class = "campfire",
    table.unpack(rows)
  })
end

function campfire.get_items(predicate, numItems)
  numItems = numItems or 5
  return query [[
    from item = index.tag "campfire-item"
    order by math.random()
    where predicate(item)
    limit numItems
  ]]
end

function campfire.get_items_by_tag(tag, numItems)
  return campfire.get_items(function(item)
    return table.includes(item.itags, tag)
  end, numItems)
end

function campfire.refresh()
  local items = {}
  local services = service.discover("campfire-refresh")
  for i, s in ipairs(services) do
    local success, result = pcall(function()
      return service.invoke(s)
    end)
    if success then
      for i, item in ipairs(result) do
        table.insert(items, item)
      end
    else
      print("Campfire service failed: " .. result)
    end
  end
  campfire.write_items(items)
  editor.flashNotification("Campfire refreshed", "info")
end

function campfire.rerender()
  -- Wait for the data page to get re-indexed
  local page = config.get("campfire.dataPage")
  sync.performFileSync(page .. ".md")
  mq.awaitEmptyQueue("indexQueue")
  -- then re-render
  editor.rebuildEditorState()
end

-- REPLACES all campfire items with the specified items
function campfire.write_items(items)
  local text = "```#campfire-item\n"
  for i, item in ipairs(items) do
    if i ~= 1 then text = text .. "---\n" end
    text = text .. yaml.stringify(item)
  end
  text = text .. "```\n"

  local page = config.get("campfire.dataPage")
  space.writePage(page, text)
end

function campfire.remove_item(ref)
  local items = query [[
    from item = index.tag "campfire-item"
    where item.ref ~= ref
  ]]
  campfire.write_items(items)
end

command.define {
  name = "Campfire: Refresh",
  run = function()
    campfire.refresh()
  end
}

command.define {
  name = "Campfire: Refresh & Re-Render",
  run = function()
    campfire.refresh()
    campfire.rerender()
  end
}
```


```space-lua
-- priority: -1
-- Separate block to ensure this goes last

local refreshInterval = config.get("campfire.autoRefresh")
if refreshInterval then
  print("Enabling campfire refresh every " .. refreshInterval .. " minutes")

  local lastRefresh = 0
  
  event.listen {
    name = "cron:secondPassed",
    run = function()
      local now = os.time()
      if (now - lastRefresh) / 60 >= refreshInterval then
        lastRefresh = now
        campfire.refresh()
      end
    end
  }
end
```

```space-style
.campfire {
  display: flex;
  flex-direction: column;
  margin-top: -1em;
  margin-bottom: -1em;
}

.campfire .row {
  display: flex;
  gap: .5em;
  margin-bottom: 1em;
  overflow-x: auto;
}

.campfire .button {
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  min-width: 220px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: var(--subtle-background-color);
  overflow: hidden;
}

.campfire .button.danger {
  border-color: red;
}

.campfire .title {
  font-size: medium !important;
  background: var(--root-background-color);
  padding: .5em;
}

.campfire .main-section {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--editor-code-color);
  flex-grow: 1;
}

.campfire .content {
  display: flex;
  gap: 1em;
  padding: .5em;
  font-size: small;
  align-items: start;
}

.campfire .image {
  object-fit: contain;  min-height: 48px;
}

.campfire .description {
  flex-grow: 1;
}

.campfire .actions {
  display: flex;
}

.campfire .action {
  flex-grow: 1;
  margin: 0 !important;
  border-radius: 0 !important;
}

.campfire .action:not(:first-child) {
  border-left: solid 1px var(--editor-blockquote-border-color) !important;
}
```