---
description: "Collection of utilites for journaling based on CBT and BuJo"
tags: meta/library
files:
- Affirmations Section.md
- Check-Ins Section.md
- Cognitive Distortions Section.md
- Feelings Section.md
- Goals Section.md
- Navigation Section.md
- Pixel Tracker Section.md
- Temperature Section.md
- Tracker Section.md
- Journal Page.md
- Journal Check-In.md
---
A set of utilities to implement a journal based on [Cognitive Behavioral Therapy (CBT)](https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral) and/or [Bullet Journaling](https://bulletjournal.com/).

> **warning** Warning
> I'm not a therapist! This is really mostly a collection of tools I've seen various CBT journaling apps provide. A therapist can help you determine what things are beneficial for you specifically to track. There is a focus here on providing a bunch of tools or ideas to help you create the journaling system that works best for you; I'm not trying to impose any singular/universally “best” system.

The core of this library is the [[Library/CBT-Journal/Journal Page|Journal Page template]]. It’s a template for making each day’s journal page, which you can then make a button for either inline (${widgets.commandButton(date.today(), "CBT Journal: Daily Note")}) somewhere or as an [[Library/Std/APIs/Action Button|action button]] in the navigation bar.

You may also want to create pages for check-ins, which can happen as often as you’d like including more than once per day. They get their own [[Library/CBT-Journal/Journal Check-In|Journal Check-In template]] which can be made with its own button (${widgets.commandButton("Check-In", "CBT Journal: Check-In")}) or action.

You’ll want to customize these templates to make it include the sections you want (including ones you make yourself!). The included sections are:
- [[Library/CBT-Journal/Affirmations Section]]
- [[Library/CBT-Journal/Check-Ins Section]]
- [[Library/CBT-Journal/Cognitive Distortions Section]]
- [[Library/CBT-Journal/Feelings Section]]
- [[Library/CBT-Journal/Goals Section]]
- [[Library/CBT-Journal/Navigation Section]]
- [[Library/CBT-Journal/Pixel Tracker Section]]
- [[Library/CBT-Journal/Temperature Section]]
- [[Library/CBT-Journal/Tracker Section]]

> **tip** Tip
> In addition to section widgets, consider adding any prompts you'd like to your page template. For example, if you're going for gratitude journaling, you could add a header and numbered list for “3 things you're grateful for today”.

> **tip** Tip
> The included page templates each have priority 10, so you can override them with your own while ensuring your changes won't get overwritten by updating this Library.

> **tip** Tip
> When adding a section to the page template, write `${"$"}` instead of just `$` to allow the Lua expression to be properly rendered once the page is created.

> **tip** Tip
> You may want different kinds of check-ins. I'd suggest always keeping the same name (time and date), but feel free to have multiple templates for stuff like temperature check-ins, gratitude check-ins, etc. You can pick which check-in to perform using the `Page: From Template` command or even designing your own command utilizing `editor.filterBox` to list the specific templates you want.

## Implementation
```space-lua
-- priority: 20
cbt_journal = {}
```