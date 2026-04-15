An implementation of a Campfire service that shows the twitch streamers you follow that are currently live.

To use, you’ll need to set the following config settings, ideally on a different page such as [[CONFIG]]:

## Twitch
```space-lua
-- priority: 50
config.set("twitch.clientId", "")
config.set("twitch.token", "")
config.set("twitch.streamers", {}) -- List of streamer usernames
```

You’ll have to go through the process of creating a Twitch app on the [developer console](https://dev.twitch.tv/console/apps/create) to get the clientId you need. You’ll set the redirect url to `localhost` and the client type to “Public”.

Additionally, a campfire item with the tag “livestream” will appear when the token needs to be obtained. To obtain it, click the card, approve the app, and then look for the token parameter in the url it redirects you to. You’ll copy that into the `twitch.token` config setting.

The live streamers will be shown in campfire items tagged “livestream” and “twitch.

## Implementation

```space-lua
-- priority: 50
twitch = {}
```

```space-lua
-- priority: 20
function twitch.get_streams(user_names)
  return twitch.fetch("/helix/streams?type=live&user_login=" .. table.concat(user_names, "&user_login=")).body
end

function twitch.fetch(url, body, method)
  local clientId = config.get("twitch.clientId")
  if not clientId then
    error("twitch.clientId config not set")
  end
  local token = config.get("twitch.token")
  if not token then
    error("twitch.token config not set")
  end
  return net.proxyFetch("https://api.twitch.tv" .. url, {
    method = method or "GET",
    headers = {
      ["Client-Id"] = clientId,
      ["Authorization"] = "Bearer " .. token
    },
    body = body
  })
end

function twitch.get_oauth_url()
  local clientId = config.get("twitch.clientId")
  return "https://id.twitch.tv/oauth2/authorize?" .. table.concat({
    "response_type=token",
    "client_id=" .. clientId,
    "redirect_uri=http://localhost",
  }, "&")
end
```

```space-lua
-- priority: -1
if config.get("twitch.clientId") and
   config.get("twitch.streamers") then
  service.define {
    selector = "campfire-refresh",
    match = {},
    run = function()
      local items = {}
      local streamers = config.get("twitch.streamers")
      local streamsRes = twitch.get_streams(streamers)
      if streamsRes.data == nil then
        -- We need to get a new oauth token
        table.insert(items, {
          description = "Get new oauth token for twitch",
          href = twitch.get_oauth_url(),
          image = "https://www.twitch.tv/favicon.ico",
          tags = { "livestream", "twitch" },
          class = "danger"
        })
        return items
      end

      local streams = streamsRes.data
      for _, stream in ipairs(streams) do
        local href = "https://www.twitch.tv/" .. stream.user_login
        local icon = stream.thumbnail_url
        icon = icon:gsub("{width}", "48")
        icon = icon:gsub("{height}", "48")

        table.insert(items, {
          description = stream.title .. "\n" .. stream.game_name,
          href = href,
          title = stream.user_name,
          image = icon,
          tags = { "livestream", "twitch" }
        })
      end

      return items
    end
  }
end
```