# Level-Up Wizard - BDD Specifications

## Overview

This document contains BDD scenarios for the Level-Up Wizard feature and Subclass Selection Modal.

---

## Feature: Level-Up Wizard

### Scenario: User initiates level up
- **Given** the user is viewing a character sheet
- **When** the user clicks the "Level Up" button
- **Then** a wizard modal appears with step 1 (HP Increase) or the first applicable step
- **And** the wizard shows a progress indicator with dots for each step

### Scenario: Wizard shows only applicable steps
- **Given** the character is level 2
- **When** the user initiates level up
- **Then** steps shown are: HP, Skills, ASI (no Subclass, no Spells)
- **And** steps are dynamically determined by CLASS_PROGRESSION data

### Scenario: HP Step - Use Average option
- **Given** the user is on the HP Step
- **When** the user selects "Use Average"
- **Then** the HP increase is calculated as floor(HitDie/2) + 1 + CON_mod
- **And** the display shows "X from HD + Y from CON"

### Scenario: HP Step - Roll Own option
- **Given** the user is on the HP Step
- **When** the user selects "Roll My Own"
- **Then** an input field appears for the user to enter their rolled value
- **And** the HP increase = entered value + CON_mod

### Scenario: HP Step - Extra HP input
- **Given** the user is on the HP Step
- **When** the user enters a value in "Extra HP" field
- **Then** the extra HP is added to the total HP increase
- **And** the NEW MAX HP reflects the extra HP

### Scenario: Subclass Step - Modal appears
- **Given** the new level requires subclass selection
- **When** the wizard reaches step 2
- **Then** a subclass selection modal appears
- **And** displays all available subclasses for the character's class

### Scenario: Subclass Modal - Carousel navigation
- **Given** the subclass modal is open
- **When** the user clicks the left or right arrow
- **Then** the carousel shows the previous or next subclass
- **And** the dot indicator updates to reflect current position

### Scenario: Subclass Modal - Card content
- **Given** a subclass is displayed in the carousel
- **Then** the card shows: Name, Tagline, Description, Level 3 features, Always Prepared spells

### Scenario: Subclass selection confirmed
- **Given** the user is viewing a subclass in the modal
- **When** the user clicks "Select This Subclass"
- **Then** the subclass is saved to the character
- **And** the wizard closes the modal and proceeds to next step

### Scenario: Skills Step - Choose new skill
- **Given** the new level grants new skills
- **When** the user reaches the Skills step
- **Then** available skills are shown (excluding already owned)
- **And** user must select the required number of skills

### Scenario: Spells Step - Prepare new spells
- **Given** the character is a caster and gains new spells at this level
- **When** the user reaches the Spells step
- **Then** available spells are shown with checkboxes
- **And** user can select which spells to prepare

### Scenario: ASI/Feat Step - Mutual exclusivity
- **Given** the user is on the ASI/Feat step
- **When** the user selects the "Ability Scores" tab
- **Then** the "Feat" section is disabled/hidden
- **And** the user can only use +/- buttons for stat increases

### Scenario: ASI/Feat Step - Choose Feat
- **Given** the user is on the ASI/Feat step
- **When** the user selects the "Feat" tab
- **Then** the ASI +/- buttons are disabled/hidden
- **And** the user can select a feat from the list

### Scenario: ASI/Feat Step - Points system
- **Given** the user is using ASI (Ability Scores)
- **Then** the user has 2 points to distribute
- **And** each +1 to a stat costs 1 point
- **And** no stat can exceed 20

### Scenario: Wizard completion - Summary screen
- **Given** the user completes all wizard steps
- **When** the user clicks "Confirm" on the final step
- **Then** a summary screen appears showing all acquired benefits
- **And** user can click "View Character Sheet" to return

---

## Feature: Subclass Modal (Standalone)

### Scenario: View subclass details before selection
- **Given** the character creation flow reaches subclass selection (level >= 3)
- **When** the subclass picker appears
- **Then** each subclass option shows a preview icon
- **And** clicking a subclass opens the detail modal

### Scenario: Subclass modal carousel - Swipe on mobile
- **Given** the subclass modal is open on mobile
- **When** the user swipes left or right
- **Then** the carousel navigates to the adjacent subclass

### Scenario: Expand subclass features for other levels
- **Given** the user is viewing a subclass in the modal
- **When** the user clicks "[?] Info"
- **Then** the modal expands to show features for all levels
- **And** user can collapse it back

---

## Feature: ASI/Feat Decision Logic

### Scenario: ASI selected - No feat allowed
- **Given** the user chooses to increase Ability Scores
- **When** the level up is confirmed
- **Then** no feat is granted
- **And** selected stats are incremented by the chosen points

### Scenario: Feat selected - No ASI allowed
- **Given** the user chooses to take a Feat
- **When** the level up is confirmed
- **Then** no stat increases are applied
- **And** the selected feat is added to character feats

### Scenario: ASI points not fully used
- **Given** the user has 2 ASI points
- **When** the user only spends 1 point
- **Then** the remaining point is lost (not saved)
- **And** only the spent point affects stats

---

## Data Dependencies

### CLASS_PROGRESSION mapping
- Level 3: Subclass Feature (if applicable)
- Level 4, 8, 12, 16, 19: Ability Score Improvement
- Skill levels: As defined per class in class data

### SUBCLASS_OPTIONS
- SubclassData.name
- SubclassData.description (tagline + full)
- SubclassData.features (by level)
- SubclassData.alwaysPreparedSpells (by level)

---

## Out of Scope

- XP/Experience tracking system
- Automatic level-up based on XP thresholds
- Multiclass level-up handling
- Feat prerequisites validation (beyond mutual exclusivity)
