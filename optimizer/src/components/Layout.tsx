import { Box, Container, Grid, Paper } from "@mantine/core";
import { useState, useEffect } from "react";
import Papa from 'papaparse';
import TitleDescription from "./TitleDescription";
import MobFilterUI from "./MobFilterUI";
import OutputDisplay from "./OutputDisplay";
import { CombinedMob, FilterValues } from "./types";

const Layout = () => {
  const [filteredResults, setFilteredResults] = useState<CombinedMob[]>([]);
  const [mobData, setMobData] = useState<CombinedMob[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [mobTypes, setMobTypes] = useState<string[]>([]);
  const [damageTypes, setDamageTypes] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const mobsResponse = await fetch('mobs.csv');
        const mobsText = await mobsResponse.text();
        const mobsResult = Papa.parse(mobsText, { header: true });

        const levelsResponse = await fetch('levels.csv');
        const levelsText = await levelsResponse.text();
        const levelsResult = Papa.parse(levelsText, { header: true });

        const combined: CombinedMob[] = [];
        const damageTypeSet = new Set<string>();
        const locationSet = new Set<string>();
        const typeSet = new Set<string>();

        mobsResult.data.forEach((mob: any) => {
          const levels = levelsResult.data.filter(
            (level: any) => level.Creature === mob.Name
          );

          levels.forEach((level: any) => {
            const damageEntries = [
              { type: 'STB', value: mob.Stb },
              { type: 'CUT', value: mob.Cut },
              { type: 'IMP', value: mob.Imp },
              { type: 'PEN', value: mob.Pen },
              { type: 'SHR', value: mob.Shr },
              { type: 'BRN', value: mob.Brn },
              { type: 'CLD', value: mob.Cld },
              { type: 'ACD', value: mob.Acd },
              { type: 'ELC', value: mob.Elc },
            ];

            const damageTypes = damageEntries
              .filter(entry => entry.value && entry.value !== '0')
              .map(entry => `${entry.type} ${entry.value}%`);

            damageTypes.forEach(dt => damageTypeSet.add(dt.split(' ')[0]));
            locationSet.add(mob['Found on']);
            typeSet.add(mob['Mob Type']);

            combined.push({
              name: mob.Name,
              location: mob['Found on'],
              type: mob['Mob Type'],
              damageTypes,
              maturity: level.Maturity,
              health: Number(level.Health) || 0,
              dangerLevel: Number(level['Danger Level']) || 0,
              hpPerLevel: Number(level['HP/Lvl']) || 0,
              attacksPerMin: Number(level['Attacks/min']) || undefined,
              movement: mob.Movement,
              combat: mob.Combat,
              aggression: mob.Aggression,
              isEvent: mob['Is Event'] === 'true',
              isInstance: mob['Is Instance'] === 'true',
              stb: Number(mob.Stb) || 0,
              cut: Number(mob.Cut) || 0,
              imp: Number(mob.Imp) || 0,
              pen: Number(mob.Pen) || 0,
              shr: Number(mob.Shr) || 0,
              brn: Number(mob.Brn) || 0,
              cld: Number(mob.Cld) || 0,
              acd: Number(mob.Acd) || 0,
              elc: Number(mob.Elc) || 0,
            });
          });
        });

        const allDamageTypes = Array.from(damageTypeSet).filter(Boolean);
        allDamageTypes.unshift('ALL'); // Add "ALL" as the first option

        setMobData(combined);
        setLocations(Array.from(locationSet).filter(Boolean));
        setMobTypes(Array.from(typeSet).filter(Boolean));
        setDamageTypes(allDamageTypes); // Use the updated damage types array
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleFilter = (filters: FilterValues) => {
    let filtered = [...mobData];

    if (filters.mobName) {
      filtered = filtered.filter(mob =>
        mob.name.toLowerCase().includes(filters.mobName.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(mob => mob.location === filters.location);
    }

    if (filters.mobType) {
      filtered = filtered.filter(mob => {
        const firstWord = mob.type.split(' ')[0];
        return firstWord === filters.mobType;
      });
    }

    if (filters.mobDamage && filters.mobDamage !== 'ALL') {
      const selectedDamageType = filters.mobDamage.toLowerCase();
      const damageColumns = ['stb', 'cut', 'imp', 'pen', 'shr', 'brn', 'cld', 'acd', 'elc'] as const;

      if (!damageColumns.includes(selectedDamageType as typeof damageColumns[number])) {
        throw new Error(`Invalid damage type: ${selectedDamageType}`);
      }

      if (filters.exclusiveDamageType) {
        filtered = filtered.filter(mob => {
          const selectedColumn = selectedDamageType as keyof CombinedMob;
          const otherColumns = damageColumns.filter(col => col !== selectedDamageType);

          return (
            (Number(mob[selectedColumn]) || 0) > 0 &&
            otherColumns.every(col => (Number(mob[col as keyof CombinedMob]) || 0) === 0)
          );
        });
      } else {
        filtered = filtered.filter(mob => {
          return (Number(mob[selectedDamageType as keyof CombinedMob]) || 0) > 0;
        });
      }
    }

    if (filters.mobCombat && filters.mobCombat !== 'All') {
      filtered = filtered.filter(mob => {
        return mob.combat === filters.mobCombat;
      });
    }

    // Handle HP filtering
    if (filters.useHpRange) {
      // HP Range Mode: Filter mobs within the specified range (inclusive)
      if (filters.minHp !== undefined || filters.maxHp !== undefined) {
        filtered = filtered.filter(mob => {
          const hp = mob.health;
          const min = filters.minHp ?? 0; // Default to 0 if minHp is undefined
          const max = filters.maxHp ?? Infinity; // Default to Infinity if maxHp is undefined
          return hp >= min && hp <= max;
        });
      }
    } else {
      // Exact HP Mode: Filter mobs with exactly the specified HP
      if (filters.minHp !== undefined) {
        filtered = filtered.filter(mob => mob.health === filters.minHp);
      }
    }

    if (filters.showAllMobs) {
      filtered = mobData.filter(mob =>
        filters.mobName ? mob.name.toLowerCase().includes(filters.mobName.toLowerCase()) : true
      );
    }

    const sorted = filtered.sort((a, b) => {
      if (a.hpPerLevel === 0 && b.hpPerLevel === 0) return 0;
      if (a.hpPerLevel === 0) return 1;
      if (b.hpPerLevel === 0) return -1;
      return a.hpPerLevel - b.hpPerLevel;
    });

    setFilteredResults(sorted);
  };

  return (
    <Container fluid p="xl" style={{ minHeight: '100vh' }}>
      <Box mb="xl" style={{ textAlign: 'center' }}>
        <TitleDescription
          title='Mob Filter UI'
          description='Use this interface to filter mobs by name, HP, location, type, and damage type.'
        />
      </Box>

      <Paper withBorder p="xl" style={{ width: '100%' }}>
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <MobFilterUI
              locations={locations}
              mobTypes={mobTypes}
              damageTypes={damageTypes}
              onApplyFilters={handleFilter}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <OutputDisplay results={filteredResults} />
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Layout;