---
feeling: 3
---

The feelings section displays a set of buttons corresponding to how you may be feeling, and highlights the selected one. 

${cbt_journal.feelings_section()}

## Implementation

```space-lua
-- priority: 10

function cbt_journal.feelings_section()
  local buttons = {}
  local fminfo = index.extractFrontmatter(editor.getText())
  local current = fminfo.frontmatter and fminfo.frontmatter.feeling

  function add_button(text, value, selectedColor)
    table.insert(buttons, dom.button {
      style = "margin-right: 0.5em; padding: .2em; font-size: 200%;" .. (current == value and ("background-color: " .. selectedColor) or ""),
      onclick = function()
        local updated = index.patchFrontmatter(editor.getText(),
        {
          { op="set-key", path="feeling", value=value },
        })
        editor.setText(updated)
        editor.rebuildEditorState()
      end,
      text
    })
  end

  add_button("🙁", 1, "red")
  add_button("☹️", 2, "red")
  add_button("😐", 3, "yellow")
  add_button("🙂", 4, "green")
  add_button("😀", 5, "green")
  return widget.html(dom.div(buttons))
end

slashcommand.define {
  name = "Feelings Section",
  run = function()
    editor.insertAtCursor("${cbt_journal.feelings_section()}\n", false, true)
  end
}
```
