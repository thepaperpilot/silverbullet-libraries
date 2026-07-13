---
name: "Library/thepaperpilot/Copyable"
tags: meta/library
---
This library registers a syntax to make text copy itself on click. This is useful for “preset messages”, codes, or other pieces of text that are expected to be copied frequently.

It makes text like this:

```
[copy]Click to copy me![/copy]
```

Render as this:

[copy]Click to copy me![/copy]

## Implementation

```space-lua
local function renderCopyOnClick(body)
  return dom.span {
    class = "copy-on-click",
    onclick = function()
      js.window.navigator.clipboard.writeText(body)
    end,
    body
  }
end

syntax.define {
  name = "Copy on click",
  startMarker = '\\[copy\\]',
  endMarker = '\\[/copy\\]',
  mode = "inline",
  renderWidget = function(body, pageName)
    return widget.html(renderCopyOnClick(body))
  end,
  renderHtml = function(body, pageName)
    return renderCopyOnClick(body)
  end
}
```

```space-style
.copy-on-click {
  cursor: pointer;
  text-decoration: underline;
}
```

