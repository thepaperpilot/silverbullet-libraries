An implementation of a Campfire service that shows active grafana alerts.

To use, you’ll need to set the following config settings, ideally on a different page such as [[CONFIG]]:

```space-lua
-- priority: 50
config.set("grafana.token", "")
config.set("grafana.baseUrl", "")
```

The feed entries will appear as campfire items tagged with “alert” and “grafana”.

## Implementation

```space-lua
-- priority: 50
grafana = {}
```

```space-lua
-- priority: 20
function grafana.get_alerts()
  return grafana.fetch("/api/prometheus/grafana/api/v1/rules").body.data.groups
end

function grafana.fetch(url, body, method)
  local baseUrl = config.get("grafana.baseUrl")
  if not baseUrl then
    error("grafana.baseUrl config not set")
  end
  local token = config.get("grafana.token")
  if not token then
    error("grafana.token config not set")
  end
  return net.proxyFetch(baseUrl .. url, {
    method = method or "GET",
    headers = {
      ["Authorization"] = "Bearer " .. token,
      ["Content-Type"] = "application/json"
    },
    body = body
  })
end
```

```space-lua
-- priority: -1
if config.get("grafana.baseUrl") and
   config.get("grafana.token") then
  service.define {
    selector = "campfire-refresh",
    match = {},
    run = function()
      local items = {}
      local baseUrl = config.get("grafana.baseUrl")
      local alertingGroups = grafana.get_alerts()
      for _, group in ipairs(alertingGroups) do
        for _, rule in ipairs(group.rules) do
          if rule.state == "firing" then
            local href = baseUrl .. "/alerting/grafana/" .. rule.uid .. "/view"

            table.insert(items, {
              description = rule.name .. " (" .. (rule.totals.alerting or 1) .. ")",
              href = href,
              image = "https://graphs.anley.space/public/build/img/apple-touch-icon.png",
              tags = { "alert", "grafana" },
              class = "danger"
            })
          end
        end
      end
      return items
    end
  }
end
```