import { ActionIcon, Box, Container, Flex, Grid, Paper, useMantineColorScheme, useMantineTheme, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import Papa from 'papaparse';
import TitleDescription from "./TitleDescription";
import MobFilterUI from "./MobFilterUI";
import OutputDisplay from "./OutputDisplay";
import { CombinedMob, FilterValues } from "./types";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
import { useToggle } from "@mantine/hooks";
import ErrorBoundary from "./ErrorBoundary";
import { Link } from 'react-router-dom'; // Import Link for navigation
import DarkModeButton from './DarkModeButton'; // Import the DarkModeButton

const Layout = () => {
  const [filteredResults, setFilteredResults] = useState<CombinedMob[]>([]);
  const [mobData, setMobData] = useState<CombinedMob[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [mobTypes, setMobTypes] = useState<string[]>([]);
  const [damageTypes, setDamageTypes] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const mobsResponse = await fetch('/EU-Hunting-Optimizer/mobs.csv');
        const mobsText = await mobsResponse.text();
        const mobsResult = Papa.parse(mobsText, { header: true });

        const levelsResponse = await fetch('/EU-Hunting-Optimizer/levels.csv');
        const levelsText = await levelsResponse.text();
        const levelsResult = Papa.parse(levelsText, { header: true });

        const combined: CombinedMob[] = [];
        const damageTypeSet = new Set<string>();
        const locationSet = new Set<string>();
        const typeSet = new Set<string>();

        mobsResult.data.forEach((mob: any) => {
          const levels = levelsResult.data.filter((level: any) => level.Creature === mob.Name);

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
              .filter((entry) => entry.value && entry.value !== '0')
              .map((entry) => `${entry.type} ${entry.value}%`);

            damageTypes.forEach((dt) => damageTypeSet.add(dt.split(' ')[0]));
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

        // Normalize damage types: Convert "ALL" to "All" and remove duplicates
        const normalizedDamageTypes = Array.from(damageTypeSet)
          .map((type) => (type === 'ALL' ? 'All' : type)) // Convert "ALL" to "All"
          .filter(Boolean); // Remove falsy values

        // Sort damage types alphabetically and prepend "All"
        const sortedDamageTypes = normalizedDamageTypes
          .filter((damage) => damage !== 'All') // Remove "All"
          .sort((a, b) => a.localeCompare(b)); // Sort alphabetically
        sortedDamageTypes.unshift('All'); // Add "All" back at the beginning

        // Add "All" to the locations list and remove duplicates and empty strings
        const locationsWithAll = ['All', ...new Set(Array.from(locationSet).filter(location => location && location.trim()))];
        console.log('Locations:', locationsWithAll); // Log the locations array

        setMobData(combined);
        setLocations(locationsWithAll); // Use the updated locations array
        setMobTypes(Array.from(typeSet).filter(Boolean));
        setDamageTypes(sortedDamageTypes); // Use the updated damage types array
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleFilter = (filters: FilterValues) => {
    let filtered = [...mobData];
  
    // If "Show All Mobs" is checked, return all mobs and ignore other filters
    if (filters.showAllMobs) {
      const sorted = [...mobData].sort((a, b) => {
        if (a.hpPerLevel === 0 && b.hpPerLevel === 0) return 0;
        if (a.hpPerLevel === 0) return 1;
        if (b.hpPerLevel === 0) return -1;
        return a.hpPerLevel - b.hpPerLevel;
      });
      setFilteredResults(sorted);
      return;
    }
  
    // If all filters are reset, clear the filtered results
    if (
      !filters.mobName &&
      filters.location === 'All' && // Check if location is "All"
      !filters.mobType &&
      filters.mobDamage === 'All' &&
      filters.mobCombat === 'All' &&
      filters.minHp === undefined &&
      filters.maxHp === undefined &&
      !filters.useHpRange &&
      !filters.exclusiveDamageType
    ) {
      setFilteredResults([]); // Clear the results
      return;
    }
  
    // Apply other filters as usual
    if (filters.mobName) {
      filtered = filtered.filter((mob) =>
        mob.name.toLowerCase().includes(filters.mobName.toLowerCase())
      );
    }
  
    // Only apply location filter if not "All"
    if (filters.location && filters.location !== 'All') {
      filtered = filtered.filter((mob) => mob.location === filters.location);
    }
  
    if (filters.mobType) {
      filtered = filtered.filter((mob) => {
        const firstWord = mob.type.split(' ')[0];
        return firstWord === filters.mobType;
      });
    }
  
    if (filters.mobDamage && filters.mobDamage !== 'All') {
      const selectedDamageType = filters.mobDamage.toLowerCase();
      const damageColumns = ['stb', 'cut', 'imp', 'pen', 'shr', 'brn', 'cld', 'acd', 'elc'] as const;
  
      if (!damageColumns.includes(selectedDamageType as typeof damageColumns[number])) {
        throw new Error(`Invalid damage type: ${selectedDamageType}`);
      }
  
      if (filters.exclusiveDamageType) {
        filtered = filtered.filter((mob) => {
          const selectedColumn = selectedDamageType as keyof CombinedMob;
          const otherColumns = damageColumns.filter((col) => col !== selectedDamageType);
  
          return (
            (Number(mob[selectedColumn]) || 0) > 0 &&
            otherColumns.every((col) => (Number(mob[col as keyof CombinedMob]) || 0) === 0)
          );
        });
      } else {
        filtered = filtered.filter((mob) => {
          return (Number(mob[selectedDamageType as keyof CombinedMob]) || 0) > 0;
        });
      }
    }
  
    if (filters.mobCombat && filters.mobCombat !== 'All') {
      filtered = filtered.filter((mob) => mob.combat === filters.mobCombat);
    }
  
    if (filters.useHpRange) {
      if (filters.minHp !== undefined || filters.maxHp !== undefined) {
        filtered = filtered.filter((mob) => {
          const hp = mob.health;
          const min = filters.minHp ?? 0; // Default to 0 if minHp is undefined
          const max = filters.maxHp ?? Infinity; // Default to Infinity if maxHp is undefined
          return hp >= min && hp <= max;
        });
      }
    } else if (filters.minHp !== undefined) {
      filtered = filtered.filter((mob) => mob.health === filters.minHp);
    }
  
    // Always sort the filtered results by HP per level
    const sorted = filtered.sort((a, b) => {
      if (a.hpPerLevel === 0 && b.hpPerLevel === 0) return 0;
      if (a.hpPerLevel === 0) return 1;
      if (b.hpPerLevel === 0) return -1;
      return a.hpPerLevel - b.hpPerLevel;
    });
  
    setFilteredResults(sorted);
  };

  return (
    <ErrorBoundary>
      <Container fluid p="xl" style={{ minHeight: '100vh' }}>
        {/* Add the Codex Optimizer button and DarkModeButton in the top row */}
        <Flex justify="space-between" align="center" mb="md">
          <Button
            component={Link}
            to="/EU-Codex-Optimizer" // Navigate to the Codex Optimizer page
            variant="outline"
            size="lg" // Large size
            style={{ 
              marginLeft: '20px', 
              fontSize: '18px', // Larger font size
              padding: '12px 24px', // More padding
              minWidth: '225px', // Set a minimum width to ensure the text fits
              whiteSpace: 'nowrap', // Prevent text from wrapping
            }}
          >
            Codex Optimizer
          </Button>
          <DarkModeButton /> {/* Add the DarkModeButton for consistency */}
        </Flex>

        <Box mb="xl" style={{ textAlign: 'center' }}>
          <TitleDescription
            title="Dominus Lux Dei's Hunting Skill Optimizer"
            description='This goal of this app is to show the best skilling mobs based on criteria you chose Ie: HP, location, or looter type. 
            To use this app, select any one input or multiple inputs to be more exact. 
            Then apply filters and a list of mobs that meet your criteria will be displayed and sorted based on their HP/Lvl ratio (Lower is better for skilling).
            In the filtered results list you can double click any mob to get a popout menu that gives more information such as aggression level.'
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
    </ErrorBoundary>
  );
};

export default Layout;