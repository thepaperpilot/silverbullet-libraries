An implementation of a Campfire service that pulls recent items from your Miniflux instance. It has special handling to show discourse threads as a single item and otherwise only show one item per feed so fast feeds don’t drown out slow feeds.

To use, you’ll need to set the following config settings, ideally on a different page such as [[CONFIG]]:

```space-lua
-- priority: 50
config.set("miniflux.token", "") -- Reference: https://miniflux.app/docs/api.html#authentication
config.set("miniflux.baseUrl", "") -- no trailing slash
config.set("miniflux.daysToShow", 0)
```

The feed entries will appear as campfire items tagged with the feed’s category on miniflux as well as “miniflux”.

## Implementation

```space-lua
-- priority: 50
miniflux = {}
```

```space-lua
-- priority: 20
function filter(arr, func)
    local result = {}
    for i, v in ipairs(arr) do
        if func(v, i) then
            table.insert(result, v)
        end
    end
    return result
end

function miniflux.get_unread()
  local res = miniflux.fetch("/v1/feeds/counters")
  if not res or not res.body or not res.body.unreads then
    error("Invalid counters response")
  end
  local feeds = res.body.unreads
  local unread = 0
  for i, v in pairs(feeds) do
    unread = unread + v
  end
  return unread
end

function miniflux.mark_read(ids)
  miniflux.fetch("/v1/entries", {
    entry_ids = ids,
    status = "read"
  }, "PUT")
end

function miniflux.save(ids)
  for i, id in ipairs(ids) do
    miniflux.fetch("/v1/entries/" .. id .. "/save", nil, "POST")
  end
end

function miniflux.get_recent_entries(days)
  local timestamp = os.time()
  timestamp = timestamp - days * 24 * 60 * 60
  local res = miniflux.fetch("/v1/entries?status=unread&after=" .. timestamp)
  if not res or not res.body or not res.body.entries then
    error("Invalid entries response: " .. JSON.stringify(res and res.body))
  end
  return res.body.entries
end

function miniflux.get_icon(id)
  return miniflux.fetch("/v1/icons/" .. id).body.data
end

function miniflux.get_failing_feeds()
  local res = miniflux.fetch("/v1/feeds")
  if not res or not res.body then
    error("Invalid feeds response")
  end
  local feeds = res.body
  return filter(feeds, function(e)
    return e.parsing_error_count > 0
  end)
end

function miniflux.fetch(url, body, method)
  local baseUrl = config.get("miniflux.baseUrl")
  if not baseUrl then
    error("miniflux.baseUrl config not set")
  end
  local token = config.get("miniflux.token")
  if not token then
    error("miniflux.token config not set")
  end
  return net.proxyFetch(baseUrl .. url, {
    method = method or "GET",
    headers = {
      ["X-Auth-Token"] = token
    },
    body = body
  })
end

campfire.clickListeners["minifluxMarkRead"] = function(item)
  campfire.remove_item(item.ref)
  campfire.rerender()
  miniflux.mark_read(item.ids)
end

campfire.actions["minifluxMarkRead"] = {
  label = "Dismiss",
  onClick = function(item)
    campfire.remove_item(item.ref)
    campfire.rerender()
    miniflux.mark_read(item.ids)
  end
}

campfire.actions["minifluxSave"] = {
  label = "Save",
  onClick = function(item)
    campfire.remove_item(item.ref)
    campfire.rerender()
    miniflux.save(item.ids)
    miniflux.mark_read(item.ids)
  end
}
```

```space-lua
-- priority: -1
function group_discourse_threads(entries)
  local grouped = {}
  local seen = {}

  for _, entry in ipairs(entries) do
    if entry.url:match("/t/") ~= nil then
      local thread_url = entry.url:match("(.+/t/.-/%d+)") or entry.url

      if not grouped[thread_url] then
        local new_entry = {}
        for k, v in pairs(entry) do
          new_entry[k] = v
        end
        new_entry.url = thread_url
        new_entry._group = { entry }
        new_entry._is_thread = true
        grouped[thread_url] = new_entry
      else
        table.insert(grouped[thread_url]._group, entry)
      end
    else
      table.insert(grouped, entry)
    end
  end

  -- Flatten result
  local result = {}
  for _, thread in pairs(grouped) do
    if thread._is_thread then
      table.sort(thread._group, function(a, b)
        return a.published_at < b.published_at
      end)
  
      -- oldest unread entry
      thread._oldest_id = thread._group[1].id
      thread.url = thread._group[1].url
  
      -- collect all ids for marking read
      thread._ids = {}
      thread.reading_time = 0
      for _, e in ipairs(thread._group) do
        table.insert(thread._ids, e.id)
        thread.reading_time = thread.reading_time + e.reading_time
      end
    end

    table.insert(result, thread)
  end
  return result
end

function one_per_feed(entries)
  local by_feed = {}
  local result = {}

  for _, entry in ipairs(entries) do
    if entry._is_thread then
      -- bypass rule entirely
      table.insert(result, entry)
    else
      local feed_id = entry.feed.id
      if not by_feed[feed_id] then
        by_feed[feed_id] = {}
      end  
      table.insert(by_feed[feed_id], entry)
    end
  end

  for _, feed_entries in pairs(by_feed) do
    local chosen = feed_entries[math.random(#feed_entries)]
    if chosen then
      table.insert(result, chosen)
    end
  end
  return result
end

if config.get("miniflux.baseUrl") and
   config.get("miniflux.token") and
   config.get("miniflux.daysToShow") then
  service.define {
    selector = "campfire-refresh",
    match = {},
    run = function()
      local items = {}

      local days = config.get("miniflux.daysToShow")
      local baseUrl = config.get("miniflux.baseUrl")
      local entries = miniflux.get_recent_entries(days)
      entries = group_discourse_threads(entries)
      entries = one_per_feed(entries)
      for i, entry in ipairs(entries) do
        local href
        local ids
        if entry._is_thread and #entry._group > 1 then
          href = entry.url
          ids = entry._ids
        else
          href = baseUrl .. "/unread/entry/" .. entry.id
          ids = { entry.id }
        end

        -- miniflux.get_icon can often get icons for feeds, but those are served as very very long URIs
        local icon = "https://www.google.com/s2/favicons?domain=" .. entry.url
        
        local description = entry.feed.title .. "\n"
        if entry._is_thread and #entry._group > 1 then
          description = description .. #entry._group .. " posts, ~"
        end
        description = description .. entry.reading_time .. " min"

        table.insert(items, {
          description = description,
          href = href,
          title = entry.title,
          image = icon,
          tags = { entry.feed.category.title, "miniflux" },
          onClick = "minifluxMarkRead",
          actions = { "minifluxMarkRead", "minifluxSave" },
          ids = ids
        })
      end

      local failingFeeds = miniflux.get_failing_feeds()
      for i, feed in ipairs(failingFeeds) do
        local icon = "https://www.google.com/s2/favicons?domain=" .. feed.site_url
        table.insert(items, {
          description = feed.parsing_error_message,
          href = baseUrl .. "/feed/" .. feed.id .. "/edit",
          title = 'Failed to update "' .. feed.title ..'" feed',
          image = icon,
          tags = { "alert" },
          class = "danger"
        })
      end

      return items
    end
  }
end
```