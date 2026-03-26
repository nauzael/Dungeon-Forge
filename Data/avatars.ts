
export const CLASS_AVATARS: Record<string, { male: string[], female: string[] }> = {
    'Barbarian': {
        male: ['/assets/avatars/barbarian_m.png', '/assets/avatars/barbarian.png'],
        female: ['/assets/avatars/barbarian_f.png']
    },
    'Bard': {
        male: ['/assets/avatars/bard_m.png', '/assets/avatars/bard.png'],
        female: ['/assets/avatars/bard_f.png']
    },
    'Cleric': {
        male: ['/assets/avatars/cleric_m.png', '/assets/avatars/cleric.png'],
        female: ['/assets/avatars/cleric_f.png']
    },
    'Druid': {
        male: ['/assets/avatars/druid_m.png', '/assets/avatars/wizard.png'],
        female: ['/assets/avatars/druid_f.png']
    },
    'Fighter': {
        male: ['/assets/avatars/fighter_m.png', '/assets/avatars/fighter.png'],
        female: ['/assets/avatars/fighter.png'] // Fallback
    },
    'Wizard': {
        male: ['/assets/avatars/wizard.png'],
        female: ['/assets/avatars/wizard.png'] // Fallback
    },
    'Rogue': {
        male: ['/assets/avatars/rogue.png'],
        female: ['/assets/avatars/rogue.png']
    },
    'Ranger': {
        male: ['/assets/avatars/ranger.png'],
        female: ['/assets/avatars/ranger.png']
    },
    'Warlock': {
        male: ['/assets/avatars/warlock.png'],
        female: ['/assets/avatars/warlock.png']
    },
    'Paladin': {
        male: ['/assets/avatars/cleric_m.png', '/assets/avatars/fighter.png'],
        female: ['/assets/avatars/cleric_f.png']
    },
    'Sorcerer': {
        male: ['/assets/avatars/warlock.png'],
        female: ['/assets/avatars/warlock.png']
    },
    'Monk': {
        male: ['/assets/avatars/fighter_m.png'],
        female: ['/assets/avatars/fighter.png']
    }
};

export const SPECIES_AVATARS: Record<string, { male: string[], female: string[] }> = {
    'Human': { male: ['/assets/avatars/fighter_m.png'], female: ['/assets/avatars/fighter.png'] },
    'Elf': { male: ['/assets/avatars/wizard.png'], female: ['/assets/avatars/wizard.png'] },
    'Dwarf': { male: ['/assets/avatars/cleric_m.png'], female: ['/assets/avatars/cleric.png'] },
    'Tiefling': { male: ['/assets/avatars/warlock.png'], female: ['/assets/avatars/warlock.png'] },
    'Halfling': { male: ['/assets/avatars/rogue.png'], female: ['/assets/avatars/rogue.png'] },
    'Dragonborn': { male: ['/assets/avatars/barbarian.png'], female: ['/assets/avatars/barbarian.png'] }
};
