The pixel tracker section shows an array of pixels, each representing a day, where the color of the pixel represents some information about that day. For example, it could appear “filled in” based on a hobby being complete, or perhaps a red/orange/green system based on the amount of exercise or water drank that happened that day. It could also be used for mood tracking, with different colors representing different moods, and so on. The goal of this section is to be able to look at trends and streaks over a long time at a glance.

To make this easier to use, there are three different types of pixel trackers you can use: one for “filling in” pixels (“boolean”), one for mapping values to different colors (e.g. moods) (“map”), and one that takes a function mapping the page itself to the color to display (“custom”).

**Boolean:**
${cbt_journal.pixel_tracker_boolean_section("feeling")}

**Map**:
${cbt_journal.pixel_tracker_map_section("feeling", {
  [1] = "purple",
  [2] = "red",
  [3] = "orange",
  [4] = "green",
  [5] = "cyan"
})}

**Custom**:
${cbt_journal.pixel_tracker_section(function (page)
      return "green"
    end, "red")}

> **warning** Warning
> As written, journal entries are expected to follow the naming scheme of `{PREFIX}/YYYY-MM-DD`, where prefix can be passed in as the third parameter and defaults to “Journal”. If you name your journal entries in a different format, you’ll need to update this code appropriately.

## Implementation

```space-lua
-- priority: 10

function cbt_journal.pixel_tracker_boolean_section(property, trueColor, falseColor, days, prefix)
  trueColor = trueColor or "green"
  falseColor = falseColor or "transparent"
  return cbt_journal.pixel_tracker_section(function (page)
    return page[property] and trueColor or falseColor
  end, falseColor, days, prefix)
end

function cbt_journal.pixel_tracker_map_section(property, map, defaultColor, days, prefix)
  defaultColor = defaultColor or "transparent"
  return cbt_journal.pixel_tracker_section(function (page)
    return map[page[property] or ""]
  end, defaultColor, days, prefix)
end

function cbt_journal.pixel_tracker_section(colorFunc, defaultColor, days, prefix)
  defaultColor = defaultColor or "transparent"
  days = days or 365
  prefix = prefix or "Journal"

  local pages = query[[
    from index.tag "page"
    where _.name:match("^" .. prefix .. "/%d+%-%d+%-%d+$")
    order by _.created desc
    limit days
  ]];
  
  local page_lookup = {}
  for _, page in ipairs(pages) do
    local date_str = page.name:gsub("^" .. prefix .. "/", "")
    page_lookup[date_str] = colorFunc(page)
  end

  local today = os.time()
  local ordered_days = {}
  for i = days - 1, 0, -1 do
    local t = today - (i * 24 * 60 * 60)
    local date_str = os.date("%Y-%m-%d", t)
    local color = page_lookup[date_str] or defaultColor
    table.insert(ordered_days, { date = date_str, color = color, weekday = tonumber(os.date("%w", t)) + 1 })
  end

  local weekdays = { {}, {}, {}, {}, {}, {}, {} }
  for _, day in ipairs(ordered_days) do
    table.insert(weekdays[day.weekday], day)
  end
  
  local day_initials = { "S", "M", "T", "W", "T", "F", "S" }
  local labels = {}
  for i, initial in ipairs(day_initials) do
    table.insert(labels, dom.div {
      initial
    })
  end
  
  local rows = {}
  for i, day_data in ipairs(weekdays) do
    local cells = {}

    for _, day in ipairs(day_data) do
      table.insert(cells, dom.div({
        class = "cell",
        style = "--color: " .. day.color,
        title = day.date
      }))
    end

    if (tonumber(os.date("%w")) + 1 < i) then
      table.insert(cells, dom.div({ class = "placeholder" }))
    end

    table.insert(rows, dom.div({
      class = "cells",
      table.unpack(cells)
    }))
  end

  local month_labels = {}
  local week_index = 1
  for i = #ordered_days, 1, -1 do
    local day = ordered_days[i]
    if day.weekday == 7 then
      week_index = week_index + 1
    end

    local month_num = tonumber(day.date:sub(6,7))
    if ordered_days[i - 1] and month_num ~= tonumber(ordered_days[i - 1].date:sub(6,7)) then
      local month_name = os.date("%b", os.time({
        year = tonumber(day.date:sub(1,4)),
        month = month_num,
        day = 1
      }))
      local offset_expr = string.format("calc(100% - (%d * 1lh) + var(--gap))", week_index)
      table.insert(month_labels, dom.div({
        style = "left: " .. offset_expr,
        month_name
      }))
    end
  end

  table.insert(rows, dom.div({
    class = "months",
    table.unpack(month_labels)
  }))

  return widget.html(dom.div({
    class = "pixel-tracker",
    dom.div {
      class = "labels",
      table.unpack(labels)
    },
    dom.div {
      class = "rows",
      table.unpack(rows)
    }
  }))
end
```

```space-style
.pixel-tracker {
  display: flex;
  --gap: 4px;
  gap: var(--gap);
}

.pixel-tracker .labels {
  flex-shrink: 0;
}

.pixel-tracker .rows {
  flex-grow: 1;
  overflow-x: hidden;
  mask-image: linear-gradient(90deg,transparent 0,#fff 18px,#fff 100%);
}

.pixel-tracker .cells {
  display: flex;
  height: 1lh;
  align-items: center;
  gap: var(--gap);
  justify-content: end;
}

.pixel-tracker .cell {
  height: calc(1lh - var(--gap));
  aspect-ratio: 1;
  background: var(--color);
  border: solid 1px gray;
  border-radius: 2px;
  box-sizing: border-box;
}

.pixel-tracker .placeholder {
  height: calc(1lh - var(--gap));
  aspect-ratio: 1;
  border: solid 1px transparent;
  border-radius: 2px;
  box-sizing: border-box;
}

.pixel-tracker .months {
  position: relative;
  height: 1lh;
  overflow: hidden;
}

.pixel-tracker .months div {
  position: absolute;
}
```
