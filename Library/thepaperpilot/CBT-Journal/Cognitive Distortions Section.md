---
cognitiveDistortionsExpanded: false
---
The thinking traps section displays a list of [cognitive distortions](https://psychcentral.com/lib/cognitive-distortions-negative-thinking) you may have fallen into today. You can select as many of them as you feel is accurate. There are different lists of distortions and descriptions for them, so consider customizing this if there’s a different list you prefer.

${cbt_journal.cognitive_distortions_section()}

> **warning** Warning
> Currently, there's no way to remove keys using the `patchFrontmatter` function, so this widget cannot remove items once they're selected.


## Implementation

```space-lua
-- priority: 10

function cbt_journal.cognitive_distortions_section()
  local options = {}
  local fminfo = index.extractFrontmatter(editor.getText())
  local expanded = fminfo.frontmatter and fminfo.frontmatter.cognitiveDistortionsExpanded
  local current = fminfo.frontmatter and fminfo.frontmatter.cognitiveDistortions or {}

  function add_option(name, description)
    if expanded then
      table.insert(options, dom.button {
        style = "padding: .5em; text-align: left;" .. (table.includes(current, name) and "background-color: var(--editor-highlight-background-color);" or ""),
        onclick = function()
          if table.includes(current, name) then
            table.remove(current, name)
          else
            table.insert(current, name)
          end
          local updated = index.patchFrontmatter(editor.getText(),
          {
            { op="set-key", path="cognitiveDistortions", value=current },
          })
          editor.setText(updated)
          editor.rebuildEditorState()
        end,
        widget.html(markdown.markdownToHtml("## " .. name .. "\n\n" .. description))
      })
    elseif table.includes(current, name) then
      table.insert(options, dom.li {
        name
      })
    end
  end

  add_option("Filtering", [[Mental filtering is draining and straining all positives in a situation and, instead, dwelling on its negatives.

Even if there are more positive aspects than negative in a situation or person, you focus on the negatives exclusively.

For example, focusing on a minor suggestion for improvement after receiving many compliments during a performance review at work may affect your mood negatively.]])
  add_option("Discounting the positive", [[Discounting positives is similar to mental filtering. The main difference is that you dismiss it as something of no value when you do think of positive aspects.

For example, if someone compliments the way you look today, you may think they’re just being nice.]])
  add_option("Polarization or all-or-nothing thinking", [[Polarized thinking is thinking about yourself and the world in an “all-or-nothing” way. Engaging in polarized thinking organizes thoughts into “either/or” categories.

All-or-nothing thinking could lead to unrealistic standards for yourself and others that could affect your relationships and motivation.

For example, if a co-worker who typically communicates well lacks attention to detail during a meeting, you may now believe she is careless in the work environment.

Your perception may cause you to expect little room for error or perfection. Perfectionism, however, can lead to unrealistic standards in your co-worker’s performance.]])
  add_option("Overgeneralization", [[When you overgeneralize something, you take an isolated negative event and turn it into a never-ending pattern of loss and defeat. Words associated with overgeneralization may include:

- always
- never
- everything
- nothing

For instance, leaving a meeting with the thought, “My ideas are _never_ included in team projects,” may not reflect the reality of this statement if it only happens occasionally.

Overgeneralization can also manifest in your thoughts about the world and its events.

For example, if you’re running late for work and hit a red light, you may think, “_Nothing_ ever goes my way!”]])
  add_option("Jumping to conclusions", [[When you jump to conclusions, you interpret an event or situation negatively without evidence supporting such a conclusion. Then, you react to your assumption.

Jumping to conclusions or “mind-reading” is often in response to a persistent thought or concern of yours.

One example includes your partner coming home with a serious look on their face. Instead of asking how they are, you may assume they’re mad at you.

Consequently, you keep your distance, although they may not desire space from you.]])
  add_option("Catastrophizing", [[Catastrophizing is related to jumping to conclusions. In this case, you may jump to the worst possible conclusion in every scenario, no matter how improbable it is.

Catastrophizing can be characterized by the occurrence of several questions following in response to one event. This cognitive distortion often comes with “what if” questions, such as:

- “What if I can’t accomplish this short-term goal?”
- “What if I don’t get the promotion after working so hard?”
- “What if I’m not really prepared for this important meeting?”
- “What if I make a mistake while giving a work presentation?”]])
  add_option("Personalization", [[Personalization leads you to believe that you’re responsible for events that are, in reality, completely or partially out of your control.

This cognitive distortion often results in you feeling guilty or assigning blame without contemplating all factors involved.

For example, you may blame yourself for being late to a night out with friends despite facing delays with getting a rideshare due to traffic.]])
  add_option("Fallacies", [[The word fallacy refers to an illusion, misconception, or error. There are three types of fallacies that are associated with distorted thinking:

- **Control**: you may feel responsible or in control of everything or feel you have no control over anything in your life
- **Fairness**: measuring every behavior and situation on a scale of fairness, and you may resent when people disagree with you
- **Change**: expecting other people to change their ways and suit your expectations or needs, especially if you pressure them enough]])
  add_option("Blame", [[Blaming refers to making others responsible for how you feel.

“You made me feel bad” is what usually defines this cognitive distortion. However, even when others engage in hurtful behaviors, you’re still in control of how you feel in most situations.

The distortion comes from believing that others have the power to affect your life, even more so than yourself.

For example, if your partner says they dislike your outfit, you may shift the blame on them for making you irritable for the remainder of the day.]])
  add_option("Should statements", [[As cognitive distortions, “should” statements are subjective ironclad rules you set for yourself and others without considering the specifics of a circumstance.

You may tell yourself that things should be a certain way with no exceptions. This may look like forming a habit of going to bed at a decent time each night.

If you believe you should always be in bed before 10:30 pm but get to bed late one night, this may make you feel doubtful in your ability to start a new habit.

However, if you’re unable to make it to bed on time, it can be helpful to consider circumstances that may have changed your nightly schedule. For example, you may have had a late dinner due to a busy day.]])
  add_option("Emotional reasoning", [[Emotional reasoning leads you to believe that the way you feel is a reflection of reality. “I feel this way about this situation. Hence, it must be a fact” defines this cognitive distortion. This cognitive distortion might also lead you to believe future events depend on how you feel.

You might also assess a random situation based on your emotional reaction. For example, if someone says something that makes you angry, you may immediately conclude that the person is treating you unfairly.]])
  add_option("Global labeling", [[Labeling or mislabeling refers to taking a single attribute and turning it into an absolute. This occurs when you judge and then define yourself or others based on an isolated event. The labels assigned are usually negative.

This is an extreme form of overgeneralization. It leads you to judge an action without taking the context into account, which in turn leads you to see yourself and others in inaccurate ways.

Assigning labels to others can also impact how you interact with them. This, in turn, could add friction to your relationships.

For example, you may label your co-worker as “negligent” if they overlook important details in a team meeting.]])
  add_option("Always being right", [[This desire turns into a cognitive distortion when it trumps everything else, including evidence and other people’s feelings.

In this cognitive distortion, you may see your own opinions as facts of life. This could look like a disagreement spilling over into a conflict if someone debates a point you’re trying to prove.]])

  if not expanded then
    if #current > 0 then
      table.insert(options, dom.button {
        style = "padding: .5em",
        onclick = function()
          local updated = index.patchFrontmatter(editor.getText(),
          {
            { op="set-key", path="cognitiveDistortionsExpanded", value=true },
          })
          editor.setText(updated)
          editor.rebuildEditorState()
        end,
        "Edit"
      })
    else
      return widget.html(dom.button {
        style = "padding: .5em",
        onclick = function()
          local updated = index.patchFrontmatter(editor.getText(),
        {
          { op="set-key", path="cognitiveDistortionsExpanded", value=true },
        })
          editor.setText(updated)
          editor.rebuildEditorState()
        end,
        "Experience any cognitive distortions today?"
      })
    end
  else
    table.insert(options, dom.button {
      style = "padding: .5em",
      onclick = function()
        local updated = index.patchFrontmatter(editor.getText(),
        {
          { op="set-key", path="cognitiveDistortionsExpanded", value=false },
        })
        editor.setText(updated)
        editor.rebuildEditorState()
      end,
      "Done editing"
    })
  end
  
  return widget.html(dom.div {
    style = "display: flex; flex-flow: column; gap: .5em",
    table.unpack(options)
  })
end

slashcommand.define {
  name = "Cognitive Distortions Section",
  run = function()
    editor.insertAtCursor("${cbt_journal.cognitive_distortions_section()}\n", false, true)
  end
}
```
