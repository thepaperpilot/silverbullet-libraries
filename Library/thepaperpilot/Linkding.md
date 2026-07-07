---
name: "Library/thepaperpilot/Linkding"
tags: meta/library
---
An implementation of the [Linkding](https://linkding.link/) API that adds a widget to pages to show saved links within a given bundle associated with that page.

To use, you’ll need to set the following config settings, ideally on a different page such as [[CONFIG]]:

```space-lua
config.set("linkding.baseUrl", "")
config.set("linkding.token", "")
```

After that you can just add `linkdingBundleId: <number>` to the frontmatter of any page and it’ll display the first 100 items within that bundle at the bottom of that page.

If you’d like to use the linkding API yourself, you’ll want to look through the [Linkding API docs](https://linkding.link/api/). Every endpoint is implemented in this library, apart from uploading bookmark assets.
 
## Implementation

```space-lua
-- priority: 50
linkding = {}
```

```space-lua
-- priority: 20
function linkding.getBookmarks(options)
  local params = {}
  for k, v in pairs(options) do
    table.insert(params, k .. "=" .. v)
  end
  return linkding.fetch("/api/bookmarks/" .. ((#params > 0) and ("?" .. table.concat(params, "&")) or ""))
end

function linkding.getArchivedBookmarks(options)
  local params = {}
  for k, v in pairs(options) do
    table.insert(params, k .. "=" .. v)
  end
  return linkding.fetch("/api/bookmarks/archived/" .. ((#params > 0) and ("?" .. table.concat(params, "&")) or ""))
end

function linkding.getBookmark(id)
  return linkding.fetch("/api/bookmarks/" .. id .. "/")
end

function linkding.checkBookmark(url)
  return linkding.fetch("/api/bookmarks/check/?url=" .. js.window.encodeURIComponent(url))
end

function linkding.createBookmark(options)
  return linkding.fetch("/api/bookmarks/", options, "POST")
end

function linkding.updateBookmark(id, options)
  return linkding.fetch("/api/bookmarks/" .. id .. "/", options, "PATCH")
end

function linkding.archiveBookmark(id)
  return linkding.fetch("/api/bookmarks/" .. id .. "/archive/", nil, "POST")
end

function linkding.unarchiveBookmark(id)
  return linkding.fetch("/api/bookmarks/" .. id .. "/unarchive/", nil, "POST")
end

function linkding.deleteBookmark(id)
  return linkding.fetch("/api/bookmarks/" .. id .. "/", nil, "DELETE")
end

function linkding.getBookmarkAssets(id)
  return linkding.fetch("/api/bookmarks/" .. id .. "/assets/")
end

function linkding.getBookmarkAsset(bookmarkId, assetId)
  return linkding.fetch("/api/bookmarks/" .. bookmarkId .. "/assets/" .. assetId .. "/")
end

function linkding.getBookmarkAssetUri(bookmarkId, assetId)
  return "linkding:" .. "/api/bookmarks/" .. bookmarkId .. "/assets/" .. assetId .. "/download/"
end

function linkding.deleteBookmarkAsset(bookmarkId, assetId)
  return linkding.fetch("/api/bookmarks/" .. bookmarkId .. "/assets/" .. assetId .. "/", nil, "DELETE")
end

function linkding.deleteBookmarkAsset(bookmarkId, assetId)
  return linkding.fetch("/api/bookmarks/" .. bookmarkId .. "/assets/" .. assetId .. "/", nil, "DELETE")
end

function linkding.getTags(limit, offset)
  limit = limit == nil and 100 or limit
  offset = offset == nil and 0 or offset
  return linkding.fetch("/api/tags/?limit=" .. limit .. "&offset=" .. offset)
end

function linkding.getTag(id)
  return linkding.fetch("/api/tags/" .. id .. "/")
end

function linkding.createTag(options)
  return linkding.fetch("/api/tags/", options, "POST")
end

function linkding.getBundles(limit, offset)
  limit = limit == nil and 100 or limit
  offset = offset == nil and 0 or offset
  return linkding.fetch("/api/bundles/?limit=" .. limit .. "&offset=" .. offset)
end

function linkding.getBundle(id)
  return linkding.fetch("/api/bundles/" .. id .. "/")
end

function linkding.createBundle(options)
  return linkding.fetch("/api/bundles/", options, "POST")
end

function linkding.updateBundle(id, options)
  return linkding.fetch("/api/bundles/" .. id .. "/", options, "PATCH")
end

function linkding.deleteBundle(id)
  return linkding.fetch("/api/bundles/" .. id .. "/", nil, "DELETE")
end

function linkding.getProfile()
  return linkding.fetch("/api/user/profile/")
end

function linkding.fetch(url, body, method)
  local baseUrl = config.get("linkding.baseUrl")
  if not baseUrl then
    error("wallabag.baseUrl config not set")
  end

  local token = config.get("linkding.token")
  if not token then
    error("linkding.token config not set")
  end

  local res = net.proxyFetch(baseUrl .. url, {
    method = method or "GET",
    headers = {
      ["Authorization"] = "Token " .. token
    },
    body = body
  })

  if not res then
    error("fetch returned nil")
  end

  return res.body
end

event.listen {
  name = "hooks:renderBottomWidgets",
  run = function(e)
    local currentPage = editor.getCurrentPageMeta()
    if currentPage.linkdingBundleId then
      local baseUrl = config.get("linkding.baseUrl")
      local bookmarks = linkding.getBookmarks({
        bundle = currentPage.linkdingBundleId
      })
      if bookmarks and bookmarks.count > 0 then
        local elements = {}
        for i, bookmark in ipairs(bookmarks.results) do
          table.insert(elements, dom.div {
            class = "bookmark",
            dom.div {
              class = "bookmark-details",
              dom.div {
                class = "bookmark-header",
                bookmark.favicon_url and dom.img {
                  class = "bookmark-favicon",
                  src = bookmark.favicon_url
                } or "",
                dom.strong({
                  style = "overflow: hidden",
                  dom.a {
                    class = "bookmark-link",
                    target = "_blank",
                    href = bookmark.url,
                    bookmark.title
                  }
                }),
                dom.a {
                  class = "bookmark-edit",
                  target = "_blank",
                  href = baseUrl .. "/bookmarks?details=" .. bookmark.id,
                  markdown.markdownToHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>')
                }
              },
              #bookmark.notes > 0 and bookmark.notes or bookmark.description or ""
            },
            bookmark.preview_image_url and dom.img {
              class = "bookmark-preview-image",
              src = bookmark.preview_image_url 
            } or ""
          })
        end
        return widget.html(dom.div {
          dom.h1 {
            "Bookmarks",
            dom.a {
              class = "bookmarks-open-link",
              target = "_blank",
              href = baseUrl .. "/bookmarks?bundle=" .. currentPage.linkdingBundleId,
              markdown.markdownToHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>')
            }
          },
          table.unpack(elements)
        })
      end
    end
  end
}

service.define {
  selector = "net.readURI:linkding:*",
  match = {priority=10},
  run = function(data)
    local p = data.uri:sub(#"linkding:"+1)
    local resp = linkding.fetch(p)
    if not resp.ok and resp.status < 400 then
      js.log("Error", resp)
      error("Error, check console")
    end
    return resp.body
  end
}
```

```space-style
.bookmarks-open-link {
  float: right;
  width: 24px;
  height: 24px;
}

.bookmark {
  display: flex;
  gap: 1em;
}

.bookmark + .bookmark {
  margin-top: 1em;
}

.bookmark-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bookmark-header {
  display: flex;
  gap: 1em;
  align-items: center;
}

.bookmark-favicon {
  object-fit: scale-down;
  width: 32px;
  height: 32px;
}

.bookmark-link {
  border-radius: 5px;
  padding: 0 5px;
  margin: 0 -5px;
  color: var(--editor-wiki-link-page-color);
  background-color: var(--editor-wiki-link-page-background-color);
  text-decoration: none;
  display: block;
  white-space: nowrap;
}

.bookmark-link .p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.bookmark-edit {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.bookmark-preview-image {
  max-height: 100%;
  max-width: 150px;
  object-fit: scale-down;
}
```