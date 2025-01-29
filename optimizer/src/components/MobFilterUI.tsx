import { useState } from 'react';
import { Select, Checkbox, TextInput, Button, Group, Box } from '@mantine/core';

interface MobFilterUIProps {
  onFilter: (filters: any) => void; // Callback to pass filtered data to the parent
}

const MobFilterUI = ({ onFilter }: MobFilterUIProps) => {
  const [mobName, setMobName] = useState('');
  const [showAllMobs, setShowAllMobs] = useState(false);
  const [hp, setHp] = useState('');
  const [minHp, setMinHp] = useState<number | undefined>(undefined); // Initialize as undefined
  const [maxHp, setMaxHp] = useState<number | undefined>(undefined); // Initialize as undefined
  const [location, setLocation] = useState('');
  const [mobType, setMobType] = useState('');
  const [mobDamage, setMobDamage] = useState('');

  const handleApplyFilters = () => {
    const filters = {
      mobName,
      showAllMobs,
      hp,
      minHp,
      maxHp,
      location,
      mobType,
      mobDamage,
    };
    onFilter(filters); // Pass filters to the parent component
  };

  return (
    <Box p="md" style={{ maxWidth: '600px', marginTop: '20px' }}>
      {/* Search Bar with Checkbox */}
      <Group mb="md" align="flex-end">
        <TextInput
          placeholder="Enter Mob Name Here"
          value={mobName}
          onChange={(event) => setMobName(event.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Checkbox
          label="Show All Mobs"
          checked={showAllMobs}
          onChange={(event) => setShowAllMobs(event.currentTarget.checked)}
        />
      </Group>

      {/* Rest of the MobFilterUI code */}
      {/* ... */}

      {/* Apply Filters Button */}
      <Button fullWidth onClick={handleApplyFilters}>
        Apply Filters
      </Button>
    </Box>
  );
};

export default MobFilterUI;