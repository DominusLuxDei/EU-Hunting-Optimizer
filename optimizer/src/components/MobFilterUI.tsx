import { useState } from 'react';
import { Select, Checkbox, TextInput, Button, Group, Box, NumberInput, Stack } from '@mantine/core';
import { LocationsData } from './LocationsData'; // Import the data
import { DamageTypeData } from './DamageTypeData'; // Corrected import
import TitleDescription from './TitleDescription'; // Import the new component

const MobFilterUI = () => {
  const [mobName, setMobName] = useState('');
  const [showAllMobs, setShowAllMobs] = useState(false);
  const [hp, setHp] = useState('');
  const [minHp, setMinHp] = useState<number | undefined>(undefined); // Initialize as undefined
  const [maxHp, setMaxHp] = useState<number | undefined>(undefined); // Initialize as undefined
  const [location, setLocation] = useState('');
  const [mobType, setMobType] = useState('');
  const [mobDamage, setMobDamage] = useState('');

  const handleApplyFilters = () => {
    // Here you can handle the filter logic
    console.log({
      mobName,
      showAllMobs,
      hp,
      minHp,
      maxHp,
      location,
      mobType,
      mobDamage,
    });
  };

  return (
    <Box p="md" style={{ maxWidth: '500px', marginLeft: '20px', marginTop: '50px' }}>
      {/* Title and Description */}
      <TitleDescription
        title="Mob Filter UI"
        description="Use this interface to filter mobs by name, HP, location, type, and damage type."
      />

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

      {/* HP Search */}
      <TextInput
        label="HP"
        placeholder="Enter HP"
        value={hp}
        onChange={(event) => setHp(event.currentTarget.value)}
        mb="md"
      />

      {/* HP Range (2 Inputs) */}
      <Group mb="md" grow>
        <NumberInput
          label="Min HP"
          placeholder="Enter Minimum HP"
          value={minHp}
          onChange={(value) => setMinHp(value === '' ? undefined : Number(value))} // Handle empty input
          min={0}
        />
        <NumberInput
          label="Max HP"
          placeholder="Enter Maximum HP"
          value={maxHp}
          onChange={(value) => setMaxHp(value === '' ? undefined : Number(value))} // Handle empty input
          min={0}
        />
      </Group>

      {/* Location Dropdown */}
      <Select
        label="Location"
        placeholder="Select Location"
        value={location}
        onChange={(value) => setLocation(value ?? '')} // Handle null or undefined
        data={LocationsData} // Use the imported data
        mb="md"
      />

      {/* Mob Type Dropdown */}
      <Select
        label="Mob Type"
        placeholder="Select Mob Type"
        value={mobType}
        onChange={(value) => setMobType(value ?? '')} // Handle null or undefined
        data={['Animal', 'Mutant', 'Robot']}
        mb="md"
      />

      {/* Mob Damage Dropdown */}
      <Select
        label="Mob Damage"
        placeholder="Select Mob Damage"
        value={mobDamage}
        onChange={(value) => setMobDamage(value ?? '')} // Handle null or undefined
        data={DamageTypeData} // Use the imported data
        mb="md"
      />

      {/* Apply Filters Button */}
      <Button fullWidth onClick={handleApplyFilters}>
        Apply Filters
      </Button>
    </Box>
  );
};

export default MobFilterUI;