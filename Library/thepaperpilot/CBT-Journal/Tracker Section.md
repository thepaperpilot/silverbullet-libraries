---
hydration: false
reading: false
brush_teeth: false
---
The trackers section shows a series of toggles that can each be turned on or off. This is useful for something like [Bullet Journal](https://bulletjournal.com/)-like habit (or other things) tracking.

${cbt_journal.tracker_section({
  hydration = "💧",
  reading = "📖",
  brush_teeth = "🪥"
})}

> **note** Note
> At some point, I'd like to add support for tristate trackers that can be “halfway” checked, as is common amongst BuJo.

## Implementation

```space-lua
-- priority: 10

function cbt_journal.tracker_section(trackers)
  local buttons = {}
  local fminfo = index.extractFrontmatter(editor.getText())

  function add_button(text, value)
    local current = fminfo.frontmatter and fminfo.frontmatter[value]
    table.insert(buttons, dom.button {
      style = "margin-right: 0.5em; padding: .2em; font-size: 200%;" .. (current and "background-color: var(--editor-highlight-background-color)" or ""),
      onclick = function()
        local updated = index.patchFrontmatter(editor.getText(),
        {
          { op="set-key", path=value, value=not current },
        })
        editor.setText(updated)
        editor.rebuildEditorState()
      end,
      text
    })
  end

  for key, text in pairs(trackers) do
    add_button(text, key)
  end

  return widget.html(dom.div(buttons))
end

slashcommand.define {
  name = "Tracker Section",
  run = function()
    editor.insertAtCursor("${cbt_journal.tracker_section({\n  \n})}\n", false, true)
    editor.moveCursor(editor.getCursor() - 5)
  end
}
```
