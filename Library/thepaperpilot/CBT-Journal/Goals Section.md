This is less of a section and more of a utility. If you write task items in your journal page, as a sort of list of goals for the day, it might be useful to have that list show up on your index page. So here's a util to do just that!

${cbt_journal.goals_for_day()}

> **tip** Tip
> The default is to show this days’ goals, but you can pass in a different date to make a widget for yesterday's goals instead.

## Implementation

```space-lua
-- priority: 10

function cbt_journal.goals_for_day(day)
  day = day or date.today()

  return template.each(query[[from index.tag "task"
  where not _.done and _.page.startsWith("Journal/" .. day)
  order by ref desc]], templates.taskItem)
end

slashcommand.define {
  name = "Today's Goals",
  run = function()
    editor.insertAtCursor("${cbt_journal.goals_for_day()}\n", false, true)
  end
}
```
