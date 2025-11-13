---
command: "CBT Journal: Daily Note"
suggestedName: "Journal/${date.today()}"
confirmName: false
openIfExists: true
tags: meta/template/page
priority: 10
pageDecoration:
  disableTOC: true
frontmatter: |
  pageDecoration:
    disableTOC: true
---

${"$"}{cbt_journal.navigation_section("^Journal/%d+%-%d+%-%d+$")}

> **quote** Daily Affirmation
> ${cbt_journal.affirmations_section({ "I choose to focus on what I can control rather than what I can't.", "I release the need to anticipate worst-case scenarios.", "I am enough just as I am, and I strive for progress, not perfection.", "My mind is clear, focused, and free from unnecessary worry.", "My presence is enough, and I contribute positively to any social setting.", "I am deserving of love, understanding, and positive connections in my social circle.", "I am not alone in this; I can reach out for support and understanding." })}

# ${date.today()}
${"$"}{cbt_journal.feelings_section()}

## Cognitive Distortions
${"$"}{cbt_journal.cognitive_distortions_section()}

## What's been on your mind?

- |^|

## Check-Ins

${"$"}{cbt_journal.checkins_section("Journal/${date.today()} ")}

${"$"}{widgets.commandButton("Check-In Now", "CBT Journal: Check-In")}
