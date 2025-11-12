---
temperature: 50
---

The temperature section displays a thermometer where the level can be slid to a desired value. There's a couple different uses for thermometers like this, but generally it comes down to expressing how you feel along some axis, such as [distress](https://ccp.net.au/suds-thermometer/).

${cbt_journal.temperature_section("temperature", "red")}

## Implementation

```space-lua
-- priority: 10

function cbt_journal.temperature_section(property, color, default, min, max, step)
  local fminfo = index.extractFrontmatter(editor.getText())
  local current = fminfo.frontmatter and fminfo.frontmatter[property]
  default = default == nil and 50 or default
  min = min == nil and 0 or min
  max = max == nil and 100 or max
  step =stepmax == nil and 5 or step

  return widget.html(dom.div {
    class = "cbt-thermometer-container",
    style = "--bar-color: " .. color .. "; --value: " .. ( ((current or default) - min) / (max - min)),
    dom.div {
      class = "cbt-thermometer-label",
      tostring(current or default)
    },
    dom.input {
      type = "range",
      value = current or default,
      min = min,
      max = max,
      step = step,
      class = "cbt-thermometer",
      onchange = function(e)
        local updated = index.patchFrontmatter(editor.getText(),
        {
          { op="set-key", path=property, value=tonumber(e.target.value) },
        })
        editor.setText(updated)
        editor.rebuildEditorState()
      end
    }
  })
end

slashcommand.define {
  name = "Temperature Section",
  run = function()
    editor.insertAtCursor("${cbt_journal.temperature_section(\"temperature\", \"red\")}\n", false, true)
  end
}
```

```space-style
.cbt-thermometer-container {
  width: 100%;
  display: flex;
  height: 2em;
  align-items: center;
  --height: 12px;
}

.cbt-thermometer-label {
  width: 2em;
  height: 2em;
  border-radius: 1em;
  background: var(--bar-color);
  align-items: center;
  justify-content: center;
  display: flex;
  margin-right: -.1em;
}

.cbt-thermometer {
  flex-grow: 1;
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
  background-color: grey;
  height: var(--height);
  border-radius: 0 var(--height) var(--height) 0;
}

/* WebKit */
.cbt-thermometer::-webkit-slider-runnable-track {
  height: var(--height);
  background: linear-gradient(
    90deg,
    var(--bar-color) 0% calc(var(--value) * calc(100% - var(--height)) + var(--height) / 2),
    transparent calc(var(--value) * calc(100% - var(--height)) + var(--height) / 2) 100%
  );
}

.cbt-thermometer::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: var(--height);
  height: var(--height);
  border-radius: 50%;
  background: var(--bar-color);
  border: solid 1px transparent;
  cursor: pointer;
}

.cbt-thermometer::-webkit-slider-thumb:active {
  background: white;
  border-color: black;
}

/* FF */
.cbt-thermometer::-moz-range-progress {
  height: var(--height);
  background-color: var(--bar-color);
}

.cbt-thermometer::-moz-range-thumb {
  width: var(--height);
  height: var(--height);
  border-radius: 50%;
  background: var(--bar-color);
  border: solid 1px transparent;
  cursor: pointer;
  box-sizing: border-box;
}

.cbt-thermometer::-moz-range-thumb:active {
  background: white;
  border-color: black;
}
```