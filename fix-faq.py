#!/usr/bin/env python3
"""
Fix duplicate FAQPage schemas in agentic-dev index.html
Removes lines 813-877 (FAQPage #2) and lines 932-1022 (FAQPage #3)
Replaces lines 154-200 (FAQPage #1) with merged 22-question version
"""

with open('index.html', 'r') as f:
    lines = f.readlines()

# Read merged FAQ content
with open('merged-faq.json', 'r') as f:
    merged_faq = f.read()

# Delete FAQPage #3 (lines 932-1022, which become 932-1022 after adjusting for 0-index)
# But we need to delete #2 first since it comes before
# Let's delete from the end backwards to avoid index shifting

# Step 1: Delete FAQPage #3 (lines 932-1022, 0-indexed: 931-1021)
del lines[931:1022]  # 1022 is exclusive, so this deletes 931-1021

# Step 2: Delete FAQPage #2 (lines 813-877, 0-indexed: 812-876)
# Note: Comment at 813 says "<!-- FAQ Schema -->", actual schema starts at 814
# Let's delete the comment too for cleanliness
del lines[812:878]  # Includes comment + schema

# Step 3: Replace FAQPage #1 (lines 154-200, 0-indexed: 153-199)
# The schema starts at line 154, let's replace 153-199 with merged version
lines[153:200] = [merged_faq + '\n']

# Write back
with open('index.html', 'w') as f:
    f.writelines(lines)

print("✓ Fixed duplicate FAQPage schemas")
print("  - Removed FAQPage #2 (7 questions)")
print("  - Removed FAQPage #3 (10 questions)")
print("  - Replaced FAQPage #1 with merged 22 questions")
