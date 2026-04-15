An implementation of a Campfire service that shows unread wallabag items.

To use, you’ll need to set the following config settings, ideally on a different page such as [[CONFIG]]:

```space-lua
config.set("wallabag.baseUrl", "")
config.set("wallabag.clientId", "")
config.set("wallabag.clientSecret", "")
config.set("wallabag.username", "")
config.set("wallabag.password", "")
```

The feed entries will appear as campfire items tagged with their tags in wallabag alongside “wallabag”.

## Implementation

```space-lua
-- priority: 50
wallabag = {}
```

```space-lua
-- priority: 20
function wallabag.get_unread()
  local res = wallabag.fetch("/api/entries?" .. table.concat({
    "archive=0",
    "detail=metadata"
  }, "&"))

  if not res then
    error("fetch returned nil")
  end

  if not res.body then
    error("response body is nil")
  end

  if not res.body._embedded then
    error("no _embedded in response: " .. JSON.stringify(res.body))
  end

  if not res.body._embedded.items then
    error("no items in response")
  end

  return res.body._embedded.items
end

function wallabag.get_access_token()
  local baseUrl = config.get("wallabag.baseUrl")
  if not baseUrl then
    error("wallabag.baseUrl config not set")
  end
  local clientId = config.get("wallabag.clientId")
  if not clientId then
    error("wallabag.clientId config not set")
  end
  local clientSecret = config.get("wallabag.clientSecret")
  if not clientSecret then
    error("wallabag.clientSecret config not set")
  end
  local username = config.get("wallabag.username")
  if not username then
    error("wallabag.username config not set")
  end
  local password = config.get("wallabag.password")
  if not password then
    error("wallabag.password config not set")
  end
  local request = net.proxyFetch(baseUrl .. "/oauth/v2/token", {
      method = "POST",
      headers = {
        ["Content-Type"] = "application/json"
      },
      body = {
        grant_type = "password",
        client_id = clientId,
        client_secret = clientSecret,
        username = username,
        password = password
      }
    })
  
  if not request or not request.body then
    error("token request failed")
  end

  if not request.body.access_token then
    error("no access_token: " .. JSON.stringify(request.body))
  end

  return request.body.access_token
end

function wallabag.fetch(url, body, method)
  local baseUrl = config.get("wallabag.baseUrl")
  if not baseUrl then
    error("wallabag.baseUrl config not set")
  end
  local token = wallabag.get_access_token()
  return net.proxyFetch(baseUrl .. url, {
    method = method or "GET",
    headers = {
      ["Authorization"] = "Bearer " .. token
    },
    body = body
  })
end
```

```space-lua
-- priority: -1
if config.get("wallabag.baseUrl") and
   config.get("wallabag.clientId") and
   config.get("wallabag.clientSecret") and
   config.get("wallabag.username") and
   config.get("wallabag.password") then
  service.define {
    selector = "campfire-refresh",
    match = {},
    run = function()
      local items = {}
      local baseUrl = config.get("wallabag.baseUrl")
      local unreadItems = wallabag.get_unread()
      if not unreadItems then
        error("unreadItems is nil")
      end
      for i, item in ipairs(unreadItems) do
        local href = baseUrl .. "/view/" .. item.id
        local icon = "https://www.google.com/s2/favicons?domain=" .. item.domain_name
        local tags = { "wallabag" }
        for i, tag in ipairs(item.tags) do
          table.insert(tags, tag.label)
        end

        table.insert(items, {
          description = item.domain_name .. "\n" .. item.reading_time .. " min",
          href = href,
          title = item.title,
          image = icon,
          tags = tags
        })
      end
      return items
    end
  }
end
```