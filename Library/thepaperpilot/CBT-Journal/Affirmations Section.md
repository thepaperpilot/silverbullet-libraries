This is a section that renders a random affirmation from a list. It's deterministic based on the page name, meaning each page will keep the save affirmation every time you visit it. You can find a list of affirmations based on the negative thoughts your trying to replace [here](https://cogbtherapy.com/cbt-blog/positive-affirmations-for-anxiety-relief).

## ${cbt_journal.affirmations_section({"Random affirmation"})}

> **tip** Tip
> Unlike other sections, this one shouldn't change after it's rendered once, so you can skip the `${"$"}` trick on the template and just have it paste regular text in the page, rather than a widget.


## Implementation

```space-lua
-- priority: 10

function cbt_journal.affirmations_section(list)
  if #list == 0 then
    return nil
  end

  local source = editor.getCurrentPage()

  local hash = 0
  for i = 1, #source do
    hash = (hash * 31 + string.byte(source, i)) % 2^31
  end

  return list[(hash % #list) + 1]
end

slashcommand.define {
  name = "Affirmations Section",
  run = function()
    editor.insertAtCursor("${cbt_journal.affirmations_section({\n  \n})}\n", false, true)
    editor.moveCursor(editor.getCursor() - 5)
  end
}
```
