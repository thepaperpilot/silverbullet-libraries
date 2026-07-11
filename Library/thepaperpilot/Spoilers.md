---
name: "Library/thepaperpilot/Spoilers"
tags: meta/library
---
This library registers a syntax to make text hidden until hover, similar to discord or discourse.

It makes text like this:

```
This text will be ||hidden||
```

Renders as this:

This text will be ||hidden||

## Implementation

```space-lua
local function renderSpoiler(body)
  return dom.span {
    class = "spoiler",
    body
  }
end

syntax.define {
  name = "Spoiler",
  startMarker = '\\|\\|',
  endMarker = '\\|\\|',
  mode = "inline",
  renderWidget = function(body, pageName)
    return widget.html(renderSpoiler(body))
  end,
  renderHtml = function(body, pageName)
    return renderSpoiler(body)
  end
}
```

```space-style
.spoiler {
  background-color: gray;
  color: transparent;
  user-select: none;
}

.spoiler:hover {
  background-color: inherit;
  color: inherit;
}
```

