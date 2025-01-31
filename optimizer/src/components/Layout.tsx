import { Box, Container, Grid, Paper } from "@mantine/core";
import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('https://api.entropianexus.com/mobs/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API Response:', data);

        if (!Array.isArray(data)) {
          throw new Error('Invalid API response format - expected array');
        }

        const locationSet = new Set<string>();
        const typeSet = new Set<string>();
        const damageTypeSet = new Set<string>();

        const processedData = data.map((mob: any, index: number) => {
          const safeMob: CombinedMob = {
            name: mob.name || mob.mob_name || `Mob ${index + 1}`,
            location: mob.location || mob.spawn_location || 'Unknown',
            type: mob.type || mob.mob_category || 'Unknown',
            damageTypes: Array.isArray(mob.damageTypes) ? mob.damageTypes :
              Array.isArray(mob.damage_types) ? mob.damage_types : [],
            maturity: mob.maturity || mob.maturity_level || 'Unknown',
            health: Number(mob.health) || Number(mob.total_health) || 0,
            dangerLevel: Number(mob.dangerLevel) || Number(mob.threat_level) || 0,
            hpPerLevel: Number(mob.hpPerLevel) || Number(mob.health_per_level) || 0,
            attacksPerMin: Number(mob.attacksPerMin) || Number(mob.attacks_per_minute) || undefined,
            movement: mob.movement || mob.movement_type || 'Unknown',
            combat: mob.combat || mob.combat_style || 'Unknown',
            aggression: mob.aggression || mob.aggression_level || 'Unknown',
            isEvent: Boolean(mob.isEvent || mob.event_mob),
            isInstance: Boolean(mob.isInstance || mob.instance_mob),
          };

          // Add validated data to sets
          if (safeMob.location) locationSet.add(safeMob.location);
          if (safeMob.type) typeSet.add(safeMob.type);
          safeMob.damageTypes.forEach((dt: string) => {
            if (dt && typeof dt === 'string') {
              damageTypeSet.add(dt);
            }
          });

          return safeMob;
        });

        console.log('Processed Mob Data:', processedData);
        
        setMobData(processedData);
        setLocations(Array.from(locationSet).filter(Boolean));
        setMobTypes(Array.from(typeSet).filter(Boolean));
        setDamageTypes(Array.from(damageTypeSet).filter(Boolean));
        setLoading(false);

        // Initial filter to show all mobs
        handleFilter({
          mobName: '',
          location: '',
          mobType: '',
          mobDamage: '',
          minHp: undefined,
          maxHp: undefined,
          showAllMobs: true,
          useHpRange: false,
        });

      } catch (err) {
        console.error('Data loading failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilter = (filters: FilterValues) => {
    const filtered = mobData.filter(mob => {
      const matchesName = mob.name.toLowerCase().includes(filters.mobName.toLowerCase());
      const matchesLocation = !filters.location || mob.location === filters.location;
      const matchesType = !filters.mobType || mob.type === filters.mobType;
      const matchesDamage = !filters.mobDamage || mob.damageTypes.includes(filters.mobDamage);
      const matchesHP = mob.health >= (filters.minHp || 0) && 
                       mob.health <= (filters.maxHp || Infinity);

      return filters.showAllMobs 
        ? matchesName
        : matchesName && matchesLocation && matchesType && matchesDamage && matchesHP;
    });

    setFilteredResults(filtered.sort((a, b) => a.dangerLevel - b.dangerLevel));
  };

  if (loading) return <Box p="xl" ta="center">Loading mob data...</Box>;
  if (error) return <Box p="xl" ta="center" c="red">Error: {error}</Box>;

  return (
    <Container fluid p="xl">
      <TitleDescription
        title="Mob Database"
        description="Browse and filter through creature information"
      />
      
      <Paper withBorder p="xl" mt="md">
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