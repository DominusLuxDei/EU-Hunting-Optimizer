import { Box, Flex } from '@mantine/core';
import { useState, useEffect } from 'react'; // Import useEffect
import { loadCSV } from './utils/loadCSV'; // Import the CSV loader
import TitleDescription from './TitleDescription';
import MobFilterUI from './MobFilterUI';
import OutputDisplay from './OutputDisplay';

const Layout = () => {
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [mobData, setMobData] = useState<any[]>([]); // State to store CSV data

  // Load CSV data on component mount
  useEffect(() => {
    const loadData = async () => {
      const mobs = await loadCSV('/data/mobs.csv'); // Path to your CSV file
      const levels = await loadCSV('/data/levels.csv'); // Path to your second CSV file
      // Combine data if necessary
      const combinedData = mobs.map((mob) => ({
        ...mob,
        ...levels.find((level) => level.id === mob.id),
      }));
      setMobData(combinedData);
    };

    loadData();
  }, []);

  const handleFilter = (filters: any) => {
    // Filter the data based on inputs
    const filtered = mobData.filter((mob) => {
      return (
        (!filters.mobName || mob.name.includes(filters.mobName)) &&
        (!filters.location || mob.location === filters.location) &&
        (!filters.mobType || mob.type === filters.mobType) &&
        (!filters.mobDamage || mob.damage === filters.mobDamage) &&
        (!filters.minHp || mob.hp >= filters.minHp) &&
        (!filters.maxHp || mob.hp <= filters.maxHp)
      );
    });

    // Sort by hp/lvl ratio (lower is better)
    const sorted = filtered.sort((a, b) => {
      const ratioA = parseFloat(a.hp) / parseFloat(a.level);
      const ratioB = parseFloat(b.hp) / parseFloat(b.level);
      return ratioA - ratioB;
    });

    setFilteredResults(sorted);
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      {/* Title and Description in the Center */}
      <Box style={{ marginBottom: '40px' }}>
        <TitleDescription
          title="Mob Filter UI"
          description="Use this interface to filter mobs by name, HP, location, type, and damage type."
        />
      </Box>

      {/* Flex Container for MobFilterUI and OutputDisplay */}
      <Flex
        style={{
          width: '100%',
          maxWidth: '1200px',
          gap: '20px',
        }}
      >
        {/* MobFilterUI on the Left */}
        <Box style={{ flex: 1 }}>
          <MobFilterUI onFilter={handleFilter} />
        </Box>

        {/* OutputDisplay on the Right */}
        <Box style={{ flex: 1 }}>
          <OutputDisplay results={filteredResults} />
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;