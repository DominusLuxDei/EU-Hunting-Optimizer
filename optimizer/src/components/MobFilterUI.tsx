import { Select, Checkbox, TextInput, Button, Group, Box, NumberInput } from '@mantine/core';
import { LocationsData } from './LocationsData'; // Import the data
import { DamageTypeData } from './DamagaTypeData';

function MobFilterUI() {
  return (
    <Box p="md" style={{ maxWidth: '400px' }}>
      {/* Search Bar with Checkbox */}
      <Group mb="md" align="flex-end">
        <TextInput
          placeholder="Enter Mob Name Here"
          style={{ flex: 1 }}
        />
        <Checkbox
          label="Show All Mobs"
        />
      </Group>

      {/* HP Search */}
      <TextInput
        label="HP"
        placeholder="Enter HP"
        mb="md"
      />

      {/* HP Range (2 Inputs) */}
      <Group mb="md" grow>
        <NumberInput
          label="Min HP"
          placeholder="Enter Minimum HP"
          min={0}
          max={10000000000000}
        />
        <NumberInput
          label="Max HP"
          placeholder="Enter Maximum HP"
          min={0}
          max={10000000000000}
        />
      </Group>

      {/* Location Dropdown */}
      <Select
        label="Location"
        placeholder="Select Location"
        data={LocationsData} /* Use the imported data */
        mb="md"
      />

      {/* Mob Type Dropdown */}
      <Select
        label="Mob Type"
        placeholder="Select Mob Type"
        data={['Animal', 'Mutant', 'Robot']}
        mb="md"
      />

      {/* Mob Damage Dropdown */}
      <Select
        label="Mob Damage"
        placeholder="Select Mob Damage"
        data={DamageTypeData} /* Use the imported data */
        mb="md"
      />

      {/* Apply Filters Button */}
      <Button fullWidth>
        Apply Filters
      </Button>
    </Box>
  );
}

export default MobFilterUI;