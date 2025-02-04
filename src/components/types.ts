// types.ts

export interface FilterValues {
  mobName: string; // Name of the mob to filter by
  location: string; // Location of the mob to filter by
  mobType: string; // Type of the mob (e.g., Animal, Mutant, Robot)
  mobDamage: string; // Selected damage type (e.g., STB, ACD, CUT)
  mobCombat: string; // Combat type (e.g., Close, Ranged)
  minHp: number | undefined; // Minimum HP for filtering
  maxHp: number | undefined; // Maximum HP for filtering
  showAllMobs: boolean; // Whether to bypass filters and show all mobs
  useHpRange: boolean; // Whether to use a range for HP filtering
  exclusiveDamageType: boolean; // Whether to apply exclusive damage type filtering
}

export interface CombinedMob {
  name: string; // Name of the mob
  location: string; // Location where the mob is found
  type: string; // Type of the mob (e.g., Animal, Mutant, Robot)
  damageTypes: string[]; // List of damage types with percentages (e.g., ["STB 100%", "ACD 50%"])
  maturity: string; // Maturity level of the mob
  health: number; // Health points of the mob
  dangerLevel: number; // Danger level of the mob
  hpPerLevel: number; // HP gained per level
  attacksPerMin?: number; // Attacks per minute (optional)
  movement?: string; // Movement type (optional)
  combat?: string; // Combat type (optional)
  aggression?: string; // Aggression level (optional)
  isEvent?: boolean; // Whether the mob is part of an event (optional)
  isInstance?: boolean; // Whether the mob is part of an instance (optional)
  stb: number; // STB damage value
  cut: number; // CUT damage value
  imp: number; // IMP damage value
  pen: number; // PEN damage value
  shr: number; // SHR damage value
  brn: number; // BRN damage value
  cld: number; // CLD damage value
  acd: number; // ACD damage value
  elc: number; // ELC damage value
}