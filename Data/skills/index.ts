
import { SKILLS_EN } from './skills-en';
import { SkillData } from './skills-en';

export { SKILLS_EN };
export type { SkillData };

export const useSkills = (): SkillData[] => {
  return SKILLS_EN;
};

export const getSkillByName = (name: string): SkillData | undefined => {
  return SKILLS_EN.find(skill => skill.name === name);
};

export const getAbilityForSkill = (skillName: string): string => {
  const skill = SKILLS_EN.find(s => s.name === skillName);
  return skill?.ability || 'DEX';
};
