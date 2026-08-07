---
name: "Library/thepaperpilot/Discord Embeds"
tags: meta/library
files:
- Library/thepaperpilot/Discord Embeds/bookmarklet.js
---
This library allows for displaying discord messages within SilverBullet, with links to the original messages. It relies on copying data about the messages in a specific format, for which there’s a handful of tools to use depending on where you use discord.

You’re not expected to write out the message data by hand, but just for example’s sake this library will take a block of text that looks like this:

```yaml
channelId: "775940965982273577"
channelName: moderator-only
serverId: "619613842141347841"
serverName: "Profectus & Friends"
serverIcon: https://placehold.co/256
messages:
- author:
    id: "131211055849275392"
    handle: thepaperpilot
    display: thepaperpilot
    avatar: https://placehold.co/256
  createdTimestamp: 2026-06-18T15:04:37.653Z
  permalink: https://discord.com/channels/619613842141347841/775940965982273577/1517183262378950837
  content: |
    # Howdy!
    - This is a **test** showing how various discord features are accurately represented in the silverbullet discord embed feature
  attachments: []
- author:
    id: "131211055849275392"
    handle: thepaperpilot
    display: thepaperpilot
    avatar: https://placehold.co/256
  createdTimestamp: 2026-06-18T15:05:37.150Z
  editedTimestamp: 2026-06-18T19:36:25.272Z
  permalink: https://discord.com/channels/619613842141347841/775940965982273577/1517183511927455804
  content: |
    Even image attachments! (although you have to open the full size yourself - no lightbox atm)
  attachments:
    - https://placehold.co/400x600
```

and render it like this:
```#discord
channelId: "775940965982273577"
channelName: moderator-only
serverId: "619613842141347841"
serverName: "Profectus & Friends"
serverIcon: https://placehold.co/256
messages:
- author:
    id: "131211055849275392"
    handle: thepaperpilot
    display: thepaperpilot
    avatar: https://placehold.co/256
  createdTimestamp: 2026-06-18T15:04:37.653Z
  permalink: https://discord.com/channels/619613842141347841/775940965982273577/1517183262378950837
  content: |
    # Howdy!
    - This is a **test** showing how various discord features are accurately represented in the silverbullet discord embed feature
  attachments: []
- author:
    id: "131211055849275392"
    handle: thepaperpilot
    display: thepaperpilot
    avatar: https://placehold.co/256
  createdTimestamp: 2026-06-18T15:05:37.150Z
  editedTimestamp: 2026-06-18T19:36:25.272Z
  permalink: https://discord.com/channels/619613842141347841/775940965982273577/1517183511927455804
  content: |
    Even image attachments! (although you have to open the full size yourself - no lightbox atm)
  attachments:
    - https://placehold.co/400x600
```
## Preserving Media
The links to images on discord will only work for a couple weeks, because Discord doesn’t want to be used as a CDN. Additionally, the profile picture URLs will stop working if the user changes their pfp. To prevent broken image links, you’ll need to download the images to SilverBullet and link to them with a relative link. This cannot happen automatically when manually pasting the text into SilverBullet, but it will happen automatically when using the “Save related conversation” command or the “Paste discord conversation” slash command.

## Related Conversations
One use case I have for this is to save conversations I have about a topic and show them in SilverBullet on relevant pages. However, I’d like to do so without storing the conversations themselves _on_ that page (especially for cases where one conversation is related to multiple pages). To that end, the `Discord: Save related conversation` command will take the discord conversation on your clipboard, saving it to a separate file titled `Conversations/<first message id>`, and tag it with the name of the page you are currently on. You can then manually add other tags. They’ll then appear in the bottom widgets of the tagged pages.

> **note** Note
> Related conversations will also appear as linked mentions. You can [disable the linked mentions widget](https://silverbullet.md/Space%20Lua/Widget@2605). I’m hoping SB itself eventually either omits relations from linked mentions or gives more customizability for determining what constitutes a linked mention. Either way, progress on that will be tracked in [this issue](https://github.com/silverbulletmd/silverbullet/issues/2024).

## Aliucord Plugin
[Aliucord](https://aliucord.com/) is a discord client for android that supports plugins. You can download a plugin to make selecting and exporting conversations to paste in SilverBullet [here](https://code.incremental.social/thepaperpilot/aliucord-plugins/raw/branch/builds/ExportMessages.zip). You’ll then install it using the instructions [here](https://aliucord.com/documentation) under “How to install plugins manually”.

The source code for the plugin is available [here](https://code.incremental.social/thepaperpilot/aliucord-plugins).

## Equicord Plugin
[Equicord](https://equicord.org/) is a discord client for desktop that supports plugins. This one requires building from source to add unofficial plugins, which is kinda a big ask but This one requires building from source to add unofficial plugins, which is kinda a big ask but if you’re willing to do that, I’ve created plugins for selecting and exporting conversations [here](https://code.incremental.social/thepaperpilot/Equicord/src/branch/feat/selectmessages/src/userplugins). The instructions to install custom userplugins is [here](https://docs.equicord.org/plugins).

## Bookmarklet
Here’s a bookmarklet you can use it to highlight the messages you want to copy to your clipboard already formatted correctly. You can drag this link to your bookmarks bar to “install” it.

[Copy discord messages](javascript:(function()%7Bconst%20SENTINEL%20%3D%20%22__ExportDiscordToSilverBullet%22%3B%0A%0Afunction%20flash(msg)%20%7B%0A%20%20var%20t%20%3D%20document.createElement(%22div%22)%3B%0A%20%20t.textContent%20%3D%20msg%3B%0A%20%20t.style.cssText%20%3D%0A%20%20%20%20%22position%3Afixed%3Bbottom%3A24px%3Bleft%3A50%25%3Btransform%3AtranslateX(-50%25)%3B%22%20%2B%0A%20%20%20%20%22background%3A%231e1f22%3Bcolor%3A%23dbdee1%3Bpadding%3A10px%2016px%3Bborder-radius%3A6px%3B%22%20%2B%0A%20%20%20%20%22z-index%3A99999%3Bbox-shadow%3A0%204px%2024px%20rgba(0%2C0%2C0%2C.4)%3Bfont%3A14px%20system-ui%3B%22%3B%0A%20%20document.body.appendChild(t)%3B%0A%20%20setTimeout(function()%20%7B%20t.remove()%3B%20%7D%2C%202500)%3B%0A%7D%0A%0Aif%20(window%5BSENTINEL%5D)%20%7B%0A%20%20if%20(location.pathname%20!%3D%3D%20window%5BSENTINEL%5D.path)%20%7B%0A%20%20%20%20window%5BSENTINEL%5D.cleanup()%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20flash(%22Selection%20mode%20already%20active.%22)%3B%0A%20%20%20%20return%3B%0A%20%20%7D%0A%7D%0A%0Afunction%20findFiber(node)%20%7B%0A%20%20var%20key%20%3D%20Object.keys(node).find(function(k)%20%7B%20return%20k.startsWith(%22__reactFiber%24%22)%3B%20%7D)%3B%0A%20%20return%20key%20%3F%20node%5Bkey%5D%20%3A%20null%3B%0A%7D%0Afunction%20walkFiber(node%2C%20predicate)%20%7B%0A%20%20var%20fiber%20%3D%20findFiber(node)%3B%0A%20%20while%20(fiber)%20%7B%0A%20%20%20%20var%20p%20%3D%20fiber.memoizedProps%3B%0A%20%20%20%20if%20(p)%20%7B%0A%20%20%20%20%20%20var%20hit%20%3D%20predicate(p)%3B%0A%20%20%20%20%20%20if%20(hit)%20return%20hit%3B%0A%20%20%20%20%7D%0A%20%20%20%20fiber%20%3D%20fiber.return%3B%0A%20%20%7D%0A%20%20return%20null%3B%0A%7D%0Afunction%20findMessageObj(node)%20%7B%0A%20%20return%20walkFiber(node%2C%20function(p)%20%7B%20return%20(p.message%20%26%26%20p.message.author)%20%3F%20p.message%20%3A%20null%3B%20%7D)%3B%0A%7D%0Afunction%20findChannelObj(node)%20%7B%0A%20%20return%20walkFiber(node%2C%20function(p)%20%7B%20return%20(p.channel%20%26%26%20p.channel.id)%20%3F%20p.channel%20%3A%20null%3B%20%7D)%3B%0A%7D%0Afunction%20findGuildObj(node)%20%7B%0A%20%20return%20walkFiber(node%2C%20function(p)%20%7B%20return%20(p.guild%20%26%26%20p.guild.id)%20%3F%20p.guild%20%3A%20null%3B%20%7D)%3B%0A%7D%0A%0Afunction%20getDmName(c)%20%7B%0A%20%20var%20recips%20%3D%20c.recipients%3B%0A%20%20if%20(!recips)%20return%20%22%22%3B%0A%20%20var%20handles%20%3D%20%5B%5D%3B%0A%20%20var%20items%20%3D%20Array.isArray(recips)%20%3F%20recips%20%3A%20Object.values(recips)%3B%0A%20%20for%20(var%20ri%20%3D%200%3B%20ri%20%3C%20items.length%3B%20ri%2B%2B)%20%7B%0A%20%20%20%20var%20r%20%3D%20items%5Bri%5D%3B%0A%20%20%20%20if%20(!r%20%7C%7C%20typeof%20r%20!%3D%3D%20%22object%22)%20continue%3B%0A%20%20%20%20var%20h%20%3D%20r.username%20%7C%7C%20r.global_name%20%7C%7C%20r.globalName%20%7C%7C%20r.name%20%7C%7C%20%22%22%3B%0A%20%20%20%20if%20(h)%20handles.push(h)%3B%0A%20%20%7D%0A%20%20return%20handles.length%20%3E%200%20%3F%20handles.join(%22%2C%20%22)%20%3A%20%22%22%3B%0A%7D%0A%0Afunction%20extractChannel(li)%20%7B%0A%20%20var%20c%20%3D%20findChannelObj(li)%3B%0A%20%20if%20(c)%20%7B%0A%20%20%20%20var%20dmName%20%3D%20getDmName(c)%3B%0A%20%20%20%20if%20(dmName)%20return%20%7B%20id%3A%20String(c.id)%2C%20name%3A%20dmName%20%7D%3B%0A%20%20%20%20if%20(c.name)%20return%20%7B%20id%3A%20String(c.id)%2C%20name%3A%20c.name%20%7D%3B%0A%20%20%7D%0A%20%20var%20parts%20%3D%20location.pathname.split(%22%2F%22)%3B%0A%20%20var%20id%20%3D%20c%20%3F%20String(c.id)%20%3A%20(parts%5B3%5D%20%7C%7C%20%22%22)%3B%0A%20%20var%20name%20%3D%20getChannelNameFromDom(li)%3B%0A%20%20return%20%7B%20id%3A%20id%2C%20name%3A%20name%20%7D%3B%0A%7D%0A%0Afunction%20getChannelNameFromDom(li)%20%7B%0A%20%20var%20aria%20%3D%20(li%20%3F%20li.closest(%22section%5Baria-label%5D%22)%20%3A%20null)%20%7C%7C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20(function()%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20var%20m%20%3D%20document.querySelector(%22li%5Bid%5E%3D%5C%22chat-messages-%5C%22%5D%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20m%20%3F%20m.closest(%22section%5Baria-label%5D%22)%20%3A%20null%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)()%3B%0A%20%20if%20(aria)%20%7B%0A%20%20%20%20var%20label%20%3D%20aria.getAttribute(%22aria-label%22)%20%7C%7C%20%22%22%3B%0A%20%20%20%20if%20(label%20%26%26%20!%2F%5E(User%7CStatus%7CSettings%7CServers%7CMembers%7CChannels)%2Fi.test(label))%20%7B%0A%20%20%20%20%20%20return%20label.replace(%2F%5E%23%2F%2C%20%22%22).trim()%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20var%20title%20%3D%20document.title%3B%0A%20%20title%20%3D%20title.replace(%2F%20%5B%5Cu2014%7C%5D%20Discord%24%2Fi%2C%20%22%22)%3B%0A%20%20title%20%3D%20title.replace(%2F%5EDiscord%20%5B%5Cu2014%7C%5D%20%2Fi%2C%20%22%22)%3B%0A%20%20var%20sepIdx%20%3D%20title.search(%2F%20%5B%5Cu2014%7C%5D%20%2F)%3B%0A%20%20if%20(sepIdx%20%3E%200)%20title%20%3D%20title.substring(0%2C%20sepIdx)%3B%0A%20%20return%20title.replace(%2F%5E%40%2F%2C%20%22%22).trim()%3B%0A%7D%0Afunction%20extractGuild(li)%20%7B%0A%20%20var%20g%20%3D%20findGuildObj(li)%3B%0A%20%20if%20(g%20%26%26%20g.id)%20%7B%0A%20%20%20%20var%20icon%20%3D%20%22%22%3B%0A%20%20%20%20if%20(g.icon)%20%7B%0A%20%20%20%20%20%20var%20ext%20%3D%20String(g.icon).startsWith(%22a_%22)%20%3F%20%22gif%22%20%3A%20%22webp%22%3B%0A%20%20%20%20%20%20icon%20%3D%20%22https%3A%2F%2Fcdn.discordapp.com%2Ficons%2F%22%20%2B%20g.id%20%2B%20%22%2F%22%20%2B%20g.icon%20%2B%20%22.%22%20%2B%20ext%20%2B%20%22%3Fsize%3D1024%22%3B%0A%20%20%20%20%7D%0A%20%20%20%20return%20%7B%20id%3A%20String(g.id)%2C%20name%3A%20g.name%20%7C%7C%20%22%22%2C%20icon%3A%20icon%20%7D%3B%0A%20%20%7D%0A%20%20var%20parts%20%3D%20location.pathname.split(%22%2F%22)%3B%0A%20%20var%20idPart%20%3D%20parts%5B2%5D%20%7C%7C%20%22%22%3B%0A%20%20if%20(idPart%20%3D%3D%3D%20%22%40me%22)%20return%20%7B%20id%3A%20%22%40me%22%2C%20name%3A%20%22%22%2C%20icon%3A%20%22%22%20%7D%3B%0A%20%20var%20name%20%3D%20%22%22%3B%0A%20%20var%20guildHeader%20%3D%20document.querySelector(%22header%5Bclass*%3D%5C%22header%5C%22%5D%20h1%2C%20header%5Bclass*%3D%5C%22header%5C%22%5D%20%5Bclass*%3D%5C%22name%5C%22%5D%22)%3B%0A%20%20if%20(guildHeader)%20name%20%3D%20guildHeader.textContent.trim()%3B%0A%20%20return%20%7B%20id%3A%20idPart%2C%20name%3A%20name%2C%20icon%3A%20%22%22%20%7D%3B%0A%7D%0A%0Afunction%20avatarUrlFor(author)%20%7B%0A%20%20if%20(!author)%20return%20%22%22%3B%0A%20%20if%20(author.avatar)%20%7B%0A%20%20%20%20var%20ext%20%3D%20String(author.avatar).startsWith(%22a_%22)%20%3F%20%22gif%22%20%3A%20%22png%22%3B%0A%20%20%20%20return%20%22https%3A%2F%2Fcdn.discordapp.com%2Favatars%2F%22%20%2B%20author.id%20%2B%20%22%2F%22%20%2B%20author.avatar%20%2B%20%22.%22%20%2B%20ext%20%2B%20%22%3Fsize%3D128%22%3B%0A%20%20%7D%0A%20%20var%20slot%20%3D%20author.discriminator%20%26%26%20author.discriminator%20!%3D%3D%20%220%22%0A%20%20%20%20%3F%20Number(author.discriminator)%20%25%205%0A%20%20%20%20%3A%20Number(BigInt(author.id%20%7C%7C%20%220%22)%20%3E%3E%2022n)%20%25%206%3B%0A%20%20return%20%22https%3A%2F%2Fcdn.discordapp.com%2Fembed%2Favatars%2F%22%20%2B%20slot%20%2B%20%22.png%22%3B%0A%7D%0A%0Afunction%20resolveTokens(raw%2C%20msgObj)%20%7B%0A%20%20if%20(!raw)%20return%20%22%22%3B%0A%20%20var%20mentions%20%3D%20new%20Map()%3B%0A%20%20(msgObj.mentions%20%7C%7C%20%5B%5D).forEach(function(u)%20%7B%20mentions.set(u.id%2C%20u)%3B%20%7D)%3B%0A%20%20var%20channels%20%3D%20new%20Map()%3B%0A%20%20(msgObj.mentionChannels%20%7C%7C%20msgObj.mention_channels%20%7C%7C%20%5B%5D).forEach(function(c)%20%7B%20channels.set(c.id%2C%20c)%3B%20%7D)%3B%0A%20%20return%20raw%0A%20%20%20%20.replace(%2F%3C%40!%3F(%5Cd%2B)%3E%2Fg%2C%20function(_%2C%20id)%20%7B%0A%20%20%20%20%20%20var%20u%20%3D%20mentions.get(id)%3B%0A%20%20%20%20%20%20var%20name%20%3D%20u%20%26%26%20(u.globalName%20%7C%7C%20u.global_name%20%7C%7C%20u.username)%3B%0A%20%20%20%20%20%20return%20%22%40%22%20%2B%20(name%20%7C%7C%20id)%3B%0A%20%20%20%20%7D)%0A%20%20%20%20.replace(%2F%3C%23(%5Cd%2B)%3E%2Fg%2C%20function(m%2C%20id)%20%7B%0A%20%20%20%20%20%20var%20c%20%3D%20channels.get(id)%3B%0A%20%20%20%20%20%20return%20c%20%26%26%20c.name%20%3F%20%22%23%22%20%2B%20c.name%20%3A%20m%3B%0A%20%20%20%20%7D)%0A%20%20%20%20.replace(%2F%3Ca%3F%3A(%5Cw%2B)%3A%5Cd%2B%3E%2Fg%2C%20function(_%2C%20n)%20%7B%20return%20%22%3A%22%20%2B%20n%20%2B%20%22%3A%22%3B%20%7D)%3B%0A%7D%0A%0Afunction%20cleanContent(raw)%20%7B%0A%20%20var%20lines%20%3D%20raw.split(%22%5Cn%22)%3B%0A%20%20var%20i%20%3D%200%3B%0A%20%20while%20(i%20%3C%20lines.length)%20%7B%0A%20%20%20%20if%20(lines%5Bi%5D.startsWith(%22%3E%3E%3E%20%22))%20%7B%0A%20%20%20%20%20%20lines%5Bi%5D%20%3D%20lines%5Bi%5D.replace(%22%3E%3E%3E%20%22%2C%20%22%3E%20%22)%3B%0A%20%20%20%20%20%20i%2B%2B%3B%0A%20%20%20%20%20%20while%20(i%20%3C%20lines.length)%20%7B%0A%20%20%20%20%20%20%20%20lines%5Bi%5D%20%3D%20%22%3E%20%22%20%2B%20lines%5Bi%5D%3B%0A%20%20%20%20%20%20%20%20i%2B%2B%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20i%2B%2B%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20return%20lines.join(%22%5Cn%22)%3B%0A%7D%0A%0Afunction%20toIso(t)%20%7B%0A%20%20if%20(!t)%20return%20%22%22%3B%0A%20%20if%20(t%20instanceof%20Date)%20return%20t.toISOString()%3B%0A%20%20if%20(typeof%20t%20%3D%3D%3D%20%22object%22)%20%7B%0A%20%20%20%20if%20(typeof%20t.toISOString%20%3D%3D%3D%20%22function%22)%20return%20t.toISOString()%3B%0A%20%20%20%20if%20(typeof%20t.toDate%20%3D%3D%3D%20%22function%22)%20return%20t.toDate().toISOString()%3B%0A%20%20%20%20if%20(typeof%20t.toString%20%3D%3D%3D%20%22function%22)%20%7B%0A%20%20%20%20%20%20var%20d%20%3D%20new%20Date(t.toString())%3B%0A%20%20%20%20%20%20if%20(!isNaN(d))%20return%20d.toISOString()%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20var%20d%20%3D%20new%20Date(t)%3B%0A%20%20return%20isNaN(d)%20%3F%20String(t)%20%3A%20d.toISOString()%3B%0A%7D%0A%0Afunction%20yamlScalar(s)%20%7B%0A%20%20if%20(s%20%3D%3D%3D%20null%20%7C%7C%20s%20%3D%3D%3D%20undefined%20%7C%7C%20s%20%3D%3D%3D%20%22%22)%20return%20'%22%22'%3B%0A%20%20s%20%3D%20String(s)%3B%0A%20%20if%20(%2F%5E-%3F%5Cd%2B(%5C.%5Cd%2B)%3F(%5BeE%5D%5B-%2B%5D%3F%5Cd%2B)%3F%24%2F.test(s))%20return%20JSON.stringify(s)%3B%0A%20%20if%20(%2F%5E%5BA-Za-z0-9_%40.%5C%2F%3A%3F%26%3D%2B%23-%5D%2B%24%2F.test(s)%20%26%26%20!%2F%5E%5B-%3F!%26*%7C%3E%25%40%60%5D%2F.test(s))%20%7B%0A%20%20%20%20return%20s%3B%0A%20%20%7D%0A%20%20return%20JSON.stringify(s)%3B%0A%7D%0Afunction%20yamlBlock(text%2C%20indent)%20%7B%0A%20%20return%20text.split(%22%5Cn%22).map(function(l)%20%7B%20return%20indent%20%2B%20l%3B%20%7D).join(%22%5Cn%22)%3B%0A%7D%0Afunction%20indentBlock(text%2C%20firstPrefix%2C%20restPrefix)%20%7B%0A%20%20return%20text.split(%22%5Cn%22)%0A%20%20%20%20.map(function(l%2C%20i)%20%7B%20return%20(i%20%3D%3D%3D%200%20%3F%20firstPrefix%20%3A%20restPrefix)%20%2B%20l%3B%20%7D)%0A%20%20%20%20.join(%22%5Cn%22)%3B%0A%7D%0Afunction%20messageToYaml(m)%20%7B%0A%20%20var%20lines%20%3D%20%5B%5D%3B%0A%20%20lines.push(%22author%3A%22)%3B%0A%20%20lines.push(%22%20%20id%3A%20%22%20%2B%20yamlScalar(m.authorId))%3B%0A%20%20lines.push(%22%20%20handle%3A%20%22%20%2B%20yamlScalar(m.handle))%3B%0A%20%20lines.push(%22%20%20display%3A%20%22%20%2B%20yamlScalar(m.display))%3B%0A%20%20lines.push(%22%20%20avatar%3A%20%22%20%2B%20yamlScalar(m.avatarUrl))%3B%0A%20%20lines.push(%22createdTimestamp%3A%20%22%20%2B%20yamlScalar(m.createdTimestamp))%3B%0A%20%20if%20(m.editedTimestamp)%20%7B%0A%20%20%20%20lines.push(%22editedTimestamp%3A%20%22%20%2B%20yamlScalar(m.editedTimestamp))%3B%0A%20%20%7D%0A%20%20lines.push(%22permalink%3A%20%22%20%2B%20yamlScalar(m.permalink))%3B%0A%20%20if%20(m.content)%20%7B%0A%20%20%20%20lines.push(%22content%3A%20%7C%22)%3B%0A%20%20%20%20lines.push(yamlBlock(m.content.replace(%2F%5Cn%2B%24%2F%2C%20%22%22)%2C%20%22%20%20%22))%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20lines.push('content%3A%20%22%22')%3B%0A%20%20%7D%0A%20%20if%20(!m.attachments%20%7C%7C%20m.attachments.length%20%3D%3D%3D%200)%20%7B%0A%20%20%20%20lines.push(%22attachments%3A%20%5B%5D%22)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20lines.push(%22attachments%3A%22)%3B%0A%20%20%20%20for%20(var%20j%20%3D%200%3B%20j%20%3C%20m.attachments.length%3B%20j%2B%2B)%20%7B%0A%20%20%20%20%20%20lines.push(%22%20%20-%20%22%20%2B%20yamlScalar(m.attachments%5Bj%5D))%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20return%20lines.join(%22%5Cn%22)%3B%0A%7D%0Afunction%20buildBlock(channel%2C%20guild%2C%20messages)%20%7B%0A%20%20var%20out%20%3D%20%5B%22%60%60%60%23discord%22%5D%3B%0A%20%20var%20isDm%20%3D%20!guild.id%20%7C%7C%20guild.id%20%3D%3D%3D%20%22%40me%22%20%7C%7C%20guild.id%20%3D%3D%3D%20%220%22%3B%0A%20%20out.push(%22channelId%3A%20%22%20%2B%20yamlScalar(channel.id))%3B%0A%20%20out.push(%22channelName%3A%20%22%20%2B%20yamlScalar(channel.name))%3B%0A%20%20if%20(!isDm)%20%7B%0A%20%20%20%20out.push(%22serverId%3A%20%22%20%2B%20yamlScalar(guild.id))%3B%0A%20%20%20%20out.push(%22serverName%3A%20%22%20%2B%20yamlScalar(guild.name))%3B%0A%20%20%20%20if%20(guild.icon)%20%7B%0A%20%20%20%20%20%20out.push(%22serverIcon%3A%20%22%20%2B%20yamlScalar(guild.icon))%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20out.push(%22messages%3A%22)%3B%0A%20%20for%20(var%20k%20%3D%200%3B%20k%20%3C%20messages.length%3B%20k%2B%2B)%20%7B%0A%20%20%20%20out.push(indentBlock(messageToYaml(messages%5Bk%5D)%2C%20%22-%20%22%2C%20%22%20%20%22))%3B%0A%20%20%7D%0A%20%20out.push(%22%60%60%60%22)%3B%0A%20%20return%20out.join(%22%5Cn%22)%20%2B%20%22%5Cn%22%3B%0A%7D%0A%0Afunction%20extractMessage(li)%20%7B%0A%20%20var%20msgObj%20%3D%20findMessageObj(li)%3B%0A%20%20if%20(!msgObj)%20%7B%0A%20%20%20%20console.warn(%22%5Bsb-export%5D%20no%20fiber%20message%20for%22%2C%20li)%3B%0A%20%20%20%20return%20null%3B%0A%20%20%7D%0A%20%20var%20a%20%3D%20msgObj.author%20%7C%7C%20%7B%7D%3B%0A%20%20var%20parts%20%3D%20location.pathname.split(%22%2F%22)%3B%0A%20%20var%20permalink%20%3D%20parts.length%20%3E%3D%204%0A%20%20%20%20%3F%20%22https%3A%2F%2Fdiscord.com%2Fchannels%2F%22%20%2B%20parts%5B2%5D%20%2B%20%22%2F%22%20%2B%20parts%5B3%5D%20%2B%20%22%2F%22%20%2B%20msgObj.id%0A%20%20%20%20%3A%20%22%22%3B%0A%20%20return%20%7B%0A%20%20%20%20messageId%3A%20msgObj.id%20%7C%7C%20%22%22%2C%0A%20%20%20%20authorId%3A%20a.id%20%7C%7C%20%22%22%2C%0A%20%20%20%20handle%3A%20a.username%20%7C%7C%20%22%22%2C%0A%20%20%20%20display%3A%20a.globalName%20%7C%7C%20a.global_name%20%7C%7C%20a.username%20%7C%7C%20%22%22%2C%0A%20%20%20%20avatarUrl%3A%20avatarUrlFor(a)%2C%0A%20%20%20%20createdTimestamp%3A%20toIso(msgObj.timestamp)%2C%0A%20%20%20%20editedTimestamp%3A%20toIso(msgObj.editedTimestamp%20%7C%7C%20msgObj.edited_timestamp)%2C%0A%20%20%20%20permalink%3A%20permalink%2C%0A%20%20%20%20content%3A%20resolveTokens(cleanContent(msgObj.content%20%7C%7C%20%22%22)%2C%20msgObj)%2C%0A%20%20%20%20attachments%3A%20(msgObj.attachments%20%7C%7C%20%5B%5D).map(function(att)%20%7B%20return%20att.url%3B%20%7D).filter(Boolean)%2C%0A%20%20%7D%3B%0A%7D%0A%0Avar%20bar%20%3D%20document.createElement(%22div%22)%3B%0Abar.id%20%3D%20%22sb-export-bar%22%3B%0Abar.innerHTML%20%3D%0A%20%20%22%3Cbutton%20id%3D%5C%22sb-close%5C%22%20class%3D%5C%22close%5C%22%3E%26%23x2715%3B%3C%2Fbutton%3E%22%20%2B%0A%20%20%22%3Cspan%20id%3D%5C%22sb-count%5C%22%3E0%20selected%3C%2Fspan%3E%22%20%2B%0A%20%20%22%3Cbutton%20id%3D%5C%22sb-export%5C%22%3EExport%3C%2Fbutton%3E%22%3B%0A%0Avar%20styleEl%20%3D%20document.createElement(%22style%22)%3B%0AstyleEl.id%20%3D%20%22sb-export-bar-style%22%3B%0AstyleEl.textContent%20%3D%0A%20%20%22%23sb-export-bar%7B%22%20%2B%0A%20%20%22display%3Aflex%3Balign-items%3Acenter%3Bgap%3A8px%3B%22%20%2B%0A%20%20%22height%3A48px%3Bpadding%3A0%208px%3B%22%20%2B%0A%20%20%22background%3Avar(--background-primary%2C%23313338)%3B%22%20%2B%0A%20%20%22border-bottom%3A1px%20solid%20var(--background-modifier-accent%2Crgba(79%2C84%2C92%2C0.48))%3B%22%20%2B%0A%20%20%22color%3Avar(--text-normal%2C%23dbdee1)%3B%22%20%2B%0A%20%20%22font-family%3Avar(--font-primary%2C%5C%22gg%20sans%5C%22%2C%5C%22Noto%20Sans%5C%22%2C%5C%22Helvetica%20Neue%5C%22%2CHelvetica%2CArial%2Csans-serif)%3B%22%20%2B%0A%20%20%22font-size%3A16px%3Bline-height%3A1.4%7D%22%20%2B%0A%20%20%22%23sb-export-bar%20button%7B%22%20%2B%0A%20%20%22background%3Anone%3Bborder%3A0%3Bborder-radius%3A3px%3Bcursor%3Apointer%3Bpadding%3A6px%2012px%3B%22%20%2B%0A%20%20%22color%3Avar(--interactive-normal%2C%23b5bac1)%3B%22%20%2B%0A%20%20%22font-family%3Ainherit%3Bfont-size%3A14px%3Bfont-weight%3A500%3Bline-height%3A1.2em%7D%22%20%2B%0A%20%20%22%23sb-export-bar%20button.close%7B%22%20%2B%0A%20%20%22font-size%3A18px%3Bpadding%3A6px%2010px%3Bline-height%3A1%7D%22%20%2B%0A%20%20%22%23sb-export-bar%20button%3Ahover%7B%22%20%2B%0A%20%20%22background%3Avar(--background-modifier-hover%2Crgba(79%2C84%2C92%2C0.16))%3B%22%20%2B%0A%20%20%22color%3Avar(--interactive-hover%2C%23dbdee1)%7D%22%20%2B%0A%20%20%22%23sb-export-bar%20button%3Aactive%7B%22%20%2B%0A%20%20%22background%3Avar(--background-modifier-active%2Crgba(79%2C84%2C92%2C0.24))%7D%22%20%2B%0A%20%20%22%23sb-export-bar%20%23sb-count%7B%22%20%2B%0A%20%20%22flex%3A1%3Bfont-weight%3A500%3B%22%20%2B%0A%20%20%22white-space%3Anowrap%3Boverflow%3Ahidden%3Btext-overflow%3Aellipsis%7D%22%20%2B%0A%20%20%22li%5Bdata-sb-selected%5D%7B%22%20%2B%0A%20%20%22box-shadow%3Ainset%204px%200%200%20var(--brand-experiment%2C%235865f2)!important%3B%22%20%2B%0A%20%20%22background%3Argba(88%2C101%2C242%2C0.08)!important%7D%22%3B%0A%0Adocument.head.appendChild(styleEl)%3B%0A%0Afunction%20mountBar()%20%7B%0A%20%20var%20header%20%3D%20document.querySelector(%22%5Bclass*%3D%5C%22subtitleContainer%5C%22%5D%22)%3B%0A%20%20if%20(!header)%20header%20%3D%20document.querySelector(%22%5Bclass*%3D%5C%22titleWrapper%5C%22%5D%22)%3B%0A%20%20if%20(!header)%20header%20%3D%20document.querySelector(%22section%5Baria-label%5D%20%3E%20div%5Bclass*%3D%5C%22header%5C%22%5D%22)%3B%0A%20%20if%20(!header)%20header%20%3D%20document.querySelector(%22div%5Bclass*%3D%5C%22chat%5C%22%5D%20%3E%20section%20%3E%20div%3Afirst-child%22)%3B%0A%20%20if%20(!header)%20header%20%3D%20document.querySelector(%22div%5Bclass*%3D%5C%22chat%5C%22%5D%20section%20%3E%20div%3Afirst-child%22)%3B%0A%20%20if%20(header)%20%7B%0A%20%20%20%20header.parentElement.insertBefore(bar%2C%20header.nextSibling)%3B%0A%20%20%20%20if%20(!header.id)%20header.id%20%3D%20%22sb-orig-header%22%3B%0A%20%20%20%20var%20hideRule%20%3D%20document.getElementById(%22sb-header-hide%22)%3B%0A%20%20%20%20if%20(!hideRule)%20%7B%0A%20%20%20%20%20%20hideRule%20%3D%20document.createElement(%22style%22)%3B%0A%20%20%20%20%20%20hideRule.id%20%3D%20%22sb-header-hide%22%3B%0A%20%20%20%20%20%20hideRule.textContent%20%3D%20%22%23%22%20%2B%20header.id%20%2B%20%22%7Bdisplay%3Anone!important%7D%22%3B%0A%20%20%20%20%20%20document.head.appendChild(hideRule)%3B%0A%20%20%20%20%7D%0A%20%20%20%20bar.style.cssText%20%3D%0A%20%20%20%20%20%20%22display%3Aflex%3Balign-items%3Acenter%3Bgap%3A8px%3B%22%20%2B%0A%20%20%20%20%20%20%22height%3A48px%3Bpadding%3A0%208px%3Bbox-sizing%3Aborder-box%3B%22%20%2B%0A%20%20%20%20%20%20%22background%3Avar(--background-primary%2C%23313338)%3B%22%20%2B%0A%20%20%20%20%20%20%22border-bottom%3A1px%20solid%20var(--background-modifier-accent%2Crgba(79%2C84%2C92%2C0.48))%3B%22%20%2B%0A%20%20%20%20%20%20%22color%3Avar(--text-normal%2C%23dbdee1)%3B%22%20%2B%0A%20%20%20%20%20%20%22font-family%3Avar(--font-primary%2C%5C%22gg%20sans%5C%22%2C%5C%22Noto%20Sans%5C%22%2C%5C%22Helvetica%20Neue%5C%22%2CHelvetica%2CArial%2Csans-serif)%3B%22%20%2B%0A%20%20%20%20%20%20%22font-size%3A16px%3Bline-height%3A1.4%22%3B%0A%20%20%20%20return%3B%0A%20%20%7D%0A%20%20fallbackMount()%3B%0A%7D%0A%0Afunction%20fallbackMount()%20%7B%0A%20%20bar.style.cssText%20%3D%0A%20%20%20%20%22box-sizing%3Aborder-box%3Bposition%3Afixed%3Btop%3A48px%3Bleft%3A240px%3Bright%3A0%3Bz-index%3A99999%3B%22%20%2B%0A%20%20%20%20%22display%3Aflex%3Balign-items%3Acenter%3Bgap%3A8px%3Bheight%3A48px%3Bpadding%3A0%208px%3B%22%20%2B%0A%20%20%20%20%22background%3Avar(--background-primary%2C%23313338)%3B%22%20%2B%0A%20%20%20%20%22border-bottom%3A1px%20solid%20var(--background-modifier-accent%2Crgba(79%2C84%2C92%2C0.48))%3B%22%20%2B%0A%20%20%20%20%22color%3Avar(--text-normal%2C%23dbdee1)%3B%22%20%2B%0A%20%20%20%20%22font-family%3Avar(--font-primary%2C%5C%22gg%20sans%5C%22%2C%5C%22Noto%20Sans%5C%22%2C%5C%22Helvetica%20Neue%5C%22%2CHelvetica%2CArial%2Csans-serif)%3B%22%20%2B%0A%20%20%20%20%22font-size%3A16px%3Bline-height%3A1.4%22%3B%0A%20%20document.body.appendChild(bar)%3B%0A%7D%0AmountBar()%3B%0A%0Avar%20initPath%20%3D%20location.pathname%3B%0Avar%20pathRafId%20%3D%20null%3B%0A(function%20watchPath()%20%7B%0A%20%20pathRafId%20%3D%20requestAnimationFrame(watchPath)%3B%0A%20%20if%20(location.pathname%20!%3D%3D%20initPath)%20%7B%0A%20%20%20%20cleanup()%3B%0A%20%20%7D%0A%7D)()%3B%0A%0Avar%20selected%20%3D%20new%20Set()%3B%0Avar%20updateCount%20%3D%20function()%20%7B%0A%20%20bar.querySelector(%22%23sb-count%22).textContent%20%3D%0A%20%20%20%20selected.size%20%2B%20%22%20selected%22%3B%0A%7D%3B%0A%0Afunction%20onClick(e)%20%7B%0A%20%20if%20(e.target.closest(%22%23sb-export-bar%22))%20return%3B%0A%20%20if%20(e.target.closest(%22a%2C%20button%2C%20%5Brole%3D%5C%22button%5C%22%5D%22))%20return%3B%0A%20%20var%20li%20%3D%20e.target.closest(%22li%5Bid%5E%3D%5C%22chat-messages-%5C%22%5D%22)%3B%0A%20%20if%20(!li)%20return%3B%0A%20%20var%20msg%20%3D%20findMessageObj(li)%3B%0A%20%20if%20(!msg)%20return%3B%0A%20%20if%20(msg.type%20!%3D%3D%20undefined%20%26%26%20msg.type%20!%3D%3D%200%20%26%26%20msg.type%20!%3D%3D%2019)%20return%3B%0A%20%20e.preventDefault()%3B%0A%20%20e.stopPropagation()%3B%0A%20%20if%20(selected.has(li))%20%7B%0A%20%20%20%20selected.delete(li)%3B%0A%20%20%20%20li.removeAttribute(%22data-sb-selected%22)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20selected.add(li)%3B%0A%20%20%20%20li.setAttribute(%22data-sb-selected%22%2C%20%22%22)%3B%0A%20%20%7D%0A%20%20updateCount()%3B%0A%7D%0Adocument.addEventListener(%22click%22%2C%20onClick%2C%20true)%3B%0A%0Afunction%20cleanup()%20%7B%0A%20%20document.removeEventListener(%22click%22%2C%20onClick%2C%20true)%3B%0A%20%20if%20(pathRafId)%20%7B%20cancelAnimationFrame(pathRafId)%3B%20pathRafId%20%3D%20null%3B%20%7D%0A%20%20selected.forEach(function(li)%20%7B%20li.removeAttribute(%22data-sb-selected%22)%3B%20%7D)%3B%0A%20%20selected.clear()%3B%0A%20%20bar.remove()%3B%0A%20%20styleEl.remove()%3B%0A%20%20var%20hideRule%20%3D%20document.getElementById(%22sb-header-hide%22)%3B%0A%20%20if%20(hideRule)%20hideRule.remove()%3B%0A%20%20delete%20window%5BSENTINEL%5D%3B%0A%7D%0A%0Abar.querySelector(%22%23sb-export%22).addEventListener(%22click%22%2C%20function()%20%7B%0A%20%20if%20(location.pathname%20!%3D%3D%20initPath)%20%7B%20cleanup()%3B%20return%3B%20%7D%0A%20%20if%20(selected.size%20%3D%3D%3D%200)%20%7B%20flash(%22No%20messages%20selected%22)%3B%20cleanup()%3B%20return%3B%20%7D%0A%20%20var%20ordered%20%3D%20Array.from(selected).sort(function(a%2C%20b)%20%7B%0A%20%20%20%20return%20a.compareDocumentPosition(b)%20%26%20Node.DOCUMENT_POSITION_FOLLOWING%20%3F%20-1%20%3A%201%3B%0A%20%20%7D)%3B%0A%20%20var%20channel%20%3D%20extractChannel(ordered%5B0%5D)%3B%0A%20%20var%20guild%20%3D%20extractGuild(ordered%5B0%5D)%3B%0A%20%20var%20messages%20%3D%20ordered.map(extractMessage).filter(function(m)%20%7B%20return%20m%20%26%26%20m.messageId%3B%20%7D)%3B%0A%20%20if%20(messages.length%20%3D%3D%3D%200)%20%7B%0A%20%20%20%20flash(%22Couldn't%20read%20message%20data%20%5Cu2014%20Discord%20DOM%20may%20have%20changed%22)%3B%0A%20%20%20%20cleanup()%3B%0A%20%20%20%20return%3B%0A%20%20%7D%0A%20%20var%20text%20%3D%20buildBlock(channel%2C%20guild%2C%20messages)%3B%0A%20%20try%20%7B%0A%20%20%20%20navigator.clipboard.writeText(text).then(function()%20%7B%0A%20%20%20%20%20%20flash(%22Copied%20%22%20%2B%20messages.length%20%2B%20%22%20messages%22)%3B%0A%20%20%20%20%7D%2C%20function(err)%20%7B%0A%20%20%20%20%20%20console.error(%22%5Bsb-export%5D%20clipboard%20write%20failed%3A%22%2C%20err)%3B%0A%20%20%20%20%20%20console.log(text)%3B%0A%20%20%20%20%20%20flash(%22Clipboard%20blocked%20%5Cu2014%20block%20printed%20to%20console%22)%3B%0A%20%20%20%20%7D)%3B%0A%20%20%7D%20catch%20(err)%20%7B%0A%20%20%20%20console.error(%22%5Bsb-export%5D%20clipboard%20write%20failed%3A%22%2C%20err)%3B%0A%20%20%20%20console.log(text)%3B%0A%20%20%20%20flash(%22Clipboard%20blocked%20%5Cu2014%20block%20printed%20to%20console%22)%3B%0A%20%20%7D%0A%20%20cleanup()%3B%0A%7D)%3B%0A%0Abar.querySelector(%22%23sb-close%22).addEventListener(%22click%22%2C%20function()%20%7B%20cleanup()%3B%20%7D)%3B%0A%0Awindow%5BSENTINEL%5D%20%3D%20%7B%20cleanup%3A%20cleanup%2C%20path%3A%20initPath%20%7D%3B%7D)()%3B)

Since you’d be running this on the browser and it’d have access to your discord information, you can choose to look through the source code [here](./bookmarklet.js) and generate the bookmarklet yourself from that source. I used [Bookmarklet Generator](https://caiorss.github.io/bookmarklet-maker/).

## Querying Conversations
Because the discord conversations are stored in [data blocks](https://silverbullet.md/Object/data), they can be dynamically queried. This could be useful to, say, get a list of discord conversations by server:

${query[[
  from p = index.tag "discord"
  group by p.serverId
  select {
    server = group[1].serverName,
    count = count()
  }
  order by name
  where p.serverId ~= nil
]]}

You might consider a where clause to filter out this page’s conversation: `p.page ~= "Library/thepaperpilot/Discord Embeds"`

## Known Bugs
Code blocks don’t use their custom renderers in transclusions, so transclusions of discord conversations will not render directly. But, instead of transcluding the conversation from page “foo”, you could query for the conversation instead. Here’s an example for rendering the conversation from the start of this page:

${(query[[
  from p = index.tag "discord"
  where p.page == "Library/thepaperpilot/Discord Embeds"
  select discord.renderTemplate(p)
]])[1]}

Another issue is quote blocks sometimes extending further than they should, because the markdown renderer Silverbullet uses treats non-empty lines after a quote to be part of the quote, and discord does not.

## Implementation
```space-lua
-- priority: 20
discord = {}
```

```space-lua
local function formatTimestamp(date, timeOnly)
  -- yaml.parse turns iso date strings into userdata objects we cannot use
  -- this can turn them back into an iso string though
  date = yaml.stringify(date)
  
  local year, month, day, hour, min, sec =
    date:match("(%d+)%-(%d+)%-(%d+)T(%d+):(%d+):(%d+)")

  year = tonumber(year)
  month = tonumber(month)
  day = tonumber(day)
  hour = tonumber(hour)
  min = tonumber(min)

  local ampm = hour >= 12 and "PM" or "AM"
  hour = hour % 12
  if hour == 0 then hour = 12 end

  if timeOnly then
    return string.format("%d:%02d %s", hour, min, ampm)
  end

  return string.format("%d/%d/%02d, %d:%02d %s",
    month, day, year % 100, hour, min, ampm)
end

function discord.renderHeader(channelId, channelName, serverId, serverName, serverIcon)
  local channelEl = serverId and channelId and dom.a {
    class = "discord-channel",
    href = "https://discord.com/channels/" .. serverId .. "/" .. channelId,
    channelName
  } or channelName and dom.span { class = "discord-channel", channelName } or ""
  return dom.div {
    class = "discord-conversation-header",
    dom.span {
      class = "discord-hashtag",
      widget.html("#")
    },
    channelEl,
    serverName and dom.div {
      class = "discord-server",
      serverName
    } or "",
    serverIcon and dom.img {
      class = "discord-server-icon",
      src = serverIcon
    } or ""
  }
end

function discord.renderMessage(message, prevAuthor)
  local mainItems = {}

  if (not message.author) or message.author.id == prevAuthor then
    table.insert(mainItems, dom.a {
      class = "discord-timestamp discord-side-timestamp",
      href = message.permalink,
      formatTimestamp(message.createdTimestamp, true)
    })
  else
  if message.author then
    table.insert(mainItems, dom.img {
      class = "discord-avatar",
      src = message.author.avatar or "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzQwIiBoZWlnaHQ9IjM0MCI+CjxwYXRoIGZpbGw9IiNEREQiIGQ9Im0xNjksLjVhMTY5LDE2OSAwIDEsMCAyLDB6bTAsODZhNzYsNzYgMCAxCjEtMiwwek01NywyODdxMjctMzUgNjctMzVoOTJxNDAsMCA2NywzNWExNjQsMTY0IDAgMCwxLTIyNiwwIi8+Cjwvc3ZnPg=="
    })
  end
    local headerItems = {}
    if message.author and message.author.handle then
      table.insert(headerItems, dom.b {
        class = "discord-author",
        title = message.author.display and message.author.display ~= message.author.handle and message.author.handle or nil,
        message.author.display or message.author.handle
      })
    end
    if message.permalink and message.createdTimestamp then
      table.insert(headerItems, dom.a {
        class = "discord-timestamp",
        href = message.permalink,
        formatTimestamp(message.createdTimestamp)
      })
    end
    if message.editedTimestamp then
      table.insert(headerItems, dom.span {
        class = "discord-edited",
        "(edited " .. formatTimestamp(message.editedTimestamp) .. ")"
      })
    end
    table.insert(mainItems, dom.div {
      class = "discord-header",
      table.unpack(headerItems)
    })
  end

  local content = { message.content }
  for _, image in ipairs(message.attachments or {}) do
    table.insert(content, dom.img {
      class = "discord-image",
      src = image
    })
  end
  table.insert(mainItems, dom.div {
    class = "discord-content",
    table.unpack(content)
  })

  return dom.div {
    class = "discord-message",
    table.unpack(mainItems)
  }
end

function discord.renderConversation(conversation)
  local messages = {}
  local prevAuthor = nil
  for _, message in ipairs(conversation.messages) do
    table.insert(messages, discord.renderMessage(message, prevAuthor))
    prevAuthor = message.author and message.author.id
  end

  local header = discord.renderHeader(
    conversation.channelId,
    conversation.channelName,
    conversation.serverId,
    conversation.serverName,
    conversation.serverIcon
  )

  return dom.div {
    class = "discord-conversation",
    header,
    table.unpack(messages)
  }
end

function discord.renderTemplate(p)
  return widget.htmlBlock(discord.renderConversation({
    channelName = p.channelName,
    channelId = p.channelId,
    serverName = p.serverName,
    serverId = p.serverId,
    serverIcon = p.serverIcon,
    messages = p.messages
  }))
end

-- takes conversation string and downloads any links to cdn.discordapp and replaces the link with one to the local file
function discord.downloadDiscordMedia(conversation)
  local hasNotified = false
  conversation = conversation:gsub(
  "(https?://cdn%.discordapp%.com([^%s%?]+)%??[^%s]*)",
    function(full, path)
      local localPath = "assets" .. path
      if not space.fileExists(localPath) then
        if not hasNotified then
          hasNotified = true
          editor.flashNotification("Archiving images...", "info")
        end
        local resp = net.proxyFetch(full)
        space.writeDocument(localPath, resp.body)
      end
      return ".fs/" .. localPath
    end
  )
  conversation = conversation:gsub(
  "(https?://media%.discordapp%.net([^%s%?]+)%??[^%s]*)",
    function(full, path)
      local localPath = "assets" .. path
      if not space.fileExists(localPath) then
        if not hasNotified then
          hasNotified = true
          editor.flashNotification("Archiving images...", "info")
        end
        local resp = net.proxyFetch(full)
        space.writeDocument(localPath, resp.body)
      end
      return ".fs/" .. localPath
    end
  )
  conversation = conversation:gsub(
    "<(a?):([^:]+):(%d+)>",
    function(animated, name, id)
      local ext = animated == "a" and "gif" or "png"
      local localPath = "assets/emojis/" .. id .. "." .. ext
      if not space.fileExists(localPath) then
        if not hasNotified then
          hasNotified = true
          editor.flashNotification("Archiving images...", "info")
        end
        local resp = net.proxyFetch("https://cdn.discordapp.com/emojis/" .. id .. "." .. ext)
        space.writeDocument(localPath, resp.body)
      end
      return "![" .. name .. "](" .. localPath .. ")"
    end
  )
  return conversation
end

codeWidget.define {
  language = "#discord",
  render = function(body)
    local conversations = {}
    for _, segment in ipairs(string.split(body, "\n---\n")) do
      local trimmed = segment:match("^[%s\n]*(.-)[%s\n]*$")
      if trimmed ~= "" then
        local convo = yaml.parse(trimmed)
        table.insert(conversations, discord.renderConversation(convo))
      end
    end
    return widget.htmlBlock(dom.div({
      table.unpack(conversations)
    }))
  end
}

tag.define {
  name = "discord",
  schema = {
    type = "object",
    properties = {
      channelId = schema.string(),
      channelName = schema.string(),
      serverId = schema.nullable("string"),
      serverName = schema.nullable("string"),
      serverIcon = schema.nullable("string"),
      -- TODO how to define schemas of objects?
      messages = schema.array("object")
    }
  }
}

command.define {
  name = "Discord: Save related conversation",
  run = function()
    -- Get conversation from clipboard
    local conversation = js.window.navigator.clipboard.readText()
    conversation = discord.downloadDiscordMedia(conversation)
    local conversationId = conversation:match("permalink:%s*https://discord%.com/channels/.-/.-/(%d+)")
    if not conversation or not conversationId then
      editor.flashNotification("Could not parse conversation", "err")
    end

    -- Write page contents
    local currentPage = editor.getCurrentPage()
    local frontmatter = {
      conversationAbout = {
        "[[" .. currentPage .. "]]"
      }
    }
    local content = "---\n" ..
      yaml.stringify(frontmatter) ..
      "---\n\n" ..
      conversation
    
    local pageName = "Conversations/" .. conversationId
    space.writePage(pageName, content)

    -- Wait for the page to get indexed
    sync.performFileSync(pageName .. ".md")
    mq.awaitEmptyQueue("indexQueue")
    -- then re-render
    codeWidget.refreshAll()
    editor.flashNotification("Conversation added!", "info")
  end
}

slashCommand.define {
  name = "Paste discord conversation",
  run = function()
    local conversation = js.window.navigator.clipboard.readText()
    conversation = discord.downloadDiscordMedia(conversation)
    editor.insertAtCursor(conversation, false, true)
  end
}

event.listen {
  name = "hooks:renderBottomWidgets",
  run = function(e)
    local currentPage = editor.getCurrentPage()
    local pages = query[[
      from r = index.relations()
      where r.kind == "conversationAbout" and
            r.to == currentPage
      select r.page
    ]]
    local conversations = query[[
      from p = index.tag "discord"
      where table.includes(pages, p.page)
      select {
        channelName = p.channelName,
        channelId = p.channelId,
        serverName = p.serverName,
        serverId = p.serverId,
        serverIcon = p.serverIcon,
        messages = p.messages
      }
    ]]
    if #conversations > 0 then
      local items = {}
      for _, convo in ipairs(conversations) do
        table.insert(items, discord.renderConversation(convo))
      end
      return widget.htmlBlock(dom.div {
        "# Relevant Conversations",
        table.unpack(items)
      })
    end
  end
}
```

```space-style
.discord-conversation {
  background: oklab(0.219511 0.00211037 -0.00744569);
  font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  padding-bottom: 1em;
}

.discord-message {
  padding-top: .125rem;
  padding-bottom: .125rem;
  padding-inline-start: calc(40px + 16px + 16px);
  min-height: 1.375rem;
  position: relative;
}

.discord-message:hover .discord-content {
  background: oklab(0.678923 0.00325415 -0.0111644 / 0.0784314);
}

.discord-message:has(.discord-header) {
  min-height: 2.75rem;
  margin-top: 1.0625rem;
}

.discord-content {
  margin-inline-start: calc(-40px - 16px - 16px);
  padding-inline-start: calc(40px + 16px + 16px);
  font-size: 1rem;
  line-height: 1.375rem;
  color: oklab(0.952693 0.000792831 -0.00253612);
  width: calc(100% - 1em);
  border-end-end-radius: 4px;
  border-start-end-radius: 4px;
}

.discord-header + .discord-content {
  margin-top: calc(-1.375rem - 4px);
  padding-top: calc(1.375rem + 4px);
}

.discord-content img:not(.discord-image) {
  height: 1lh;
}

.discord-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  margin-top: calc(4px - .125rem);
  inset-inline-start: 16px;
}

.discord-header {
  line-height: 1.375rem;
  min-height: 1.375rem;
}

.discord-author {
  color: oklab(0.988078 0.0000451207 0.0000197291);
  margin-inline-end: .25rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.375rem;
  vertical-align: baseline;
}

.discord-timestamp {
  color: oklab(0.608375 0.00218922 -0.0118429);
  font-size: .75rem;
  line-height: 1.375rem;
  margin-inline-start: .25rem;
  height: 1.25rem;
  font-weight: 500;
  vertical-align: baseline;
}

.discord-timestamp.discord-side-timestamp {
  position: absolute;
  height: 1.375rem;
  font-size: .6875rem;
  inset-inline-start: 16px;
  opacity: 0;
}

.discord-message:hover .discord-timestamp.discord-side-timestamp {
  opacity: 1;
}

.discord-conversation-header {
  background: oklab(0.219511 0.00211037 -0.00744569);
  height: calc(40px + 8px);
  width: 100%;
  padding: 8px;
  padding-inline-start: 16px;
  border-bottom: solid 1px oklab(0.678923 0.00325415 -0.0111644 / 0.121569);
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.discord-hashtag {
  color: oklab(0.608375 0.00218922 -0.0118429);
  margin-inline: -1px 9px;
}

.discord-server {
  flex-grow: 1;
  text-align: right;
  margin-right: 9px;
}

.discord-server-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
}

.discord-image {
  max-width: 100%;
  max-height: 350px;
  border-radius: 8px;
  display: block;
}

.discord-message blockquote {
  position: relative;
  margin: 0;
  padding-left: 1em;
}

.discord-message blockquote::before {
  content: "";
  position: absolute;
  background-color: #474851;
  width: 4px;
  height: 100%;
  left: .25em;
  border-radius: 4px;
}
```