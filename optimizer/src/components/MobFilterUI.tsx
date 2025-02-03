import { useState } from 'react';
import { Select, Checkbox, TextInput, Button, Group, Box, NumberInput, Stack } from '@mantine/core';
import { FilterValues } from './types';

interface MobFilterUIProps {
  locations: string[];
  mobTypes: string[];
  damageTypes: string[];
  onApplyFilters: (filters: FilterValues) => void;
}

const MobFilterUI = ({ locations, damageTypes, onApplyFilters }: MobFilterUIProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    mobName: '',
    location: '',
    mobType: '',
    mobDamage: 'All', // Default value for Damage Type is "All"
    mobCombat: 'All',
    minHp: undefined,
    maxHp: undefined,
    showAllMobs: false,
    useHpRange: false,
    exclusiveDamageType: false,
  });

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({
      mobName: '',
      location: '',
      mobType: '',
      mobDamage: 'All', // Reset Damage Type to "All"
      mobCombat: 'All',
      minHp: undefined,
      maxHp: undefined,
      showAllMobs: false,
      useHpRange: false,
      exclusiveDamageType: false,
    });
    onApplyFilters({
      mobName: '',
      location: '',
      mobType: '',
      mobDamage: 'All', // Reset Damage Type to "All"
      mobCombat: 'All',
      minHp: undefined,
      maxHp: undefined,
      showAllMobs: false,
      useHpRange: false,
      exclusiveDamageType: false,
    });
  };

  // Sort locations alphabetically
  const sortedLocations = [...locations].sort((a, b) => a.localeCompare(b));

  // Define the correct mob type options
  const mobTypeOptions = [
    { value: '', label: 'All Mobs' },
    { value: 'Animal', label: 'Animal' },
    { value: 'Mutant', label: 'Mutant' },
    { value: 'Robot', label: 'Robot' },
  ];

  // Define the combat type options
  const combatTypeOptions = [
    { value: 'All', label: 'All' },
    { value: 'Close', label: 'Close' },
    { value: 'Ranged', label: 'Ranged' },
  ];

  return (
    <Box p="md" style={{ maxWidth: '500px', marginLeft: '20px' }}>
      <Stack>
        {/* Mob Name Search */}
        <Group grow>
          <TextInput
            placeholder="Search mob name"
            value={filters.mobName}
            onChange={(e) => setFilters({ ...filters, mobName: e.target.value })}
          />
          <Checkbox
            label="Show all mobs"
            checked={filters.showAllMobs}
            onChange={(e) => setFilters({ ...filters, showAllMobs: e.currentTarget.checked })}
          />
        </Group>

        {/* HP Filtering */}
        <Group grow>
          {filters.useHpRange ? (
            <>
              <NumberInput
                label="HP From"
                placeholder="Minimum"
                value={filters.minHp ?? ''}
                onChange={(value) => {
                  const numValue = typeof value === 'string' ? 
                    (value === '' ? undefined : Number(value)) : 
                    value;
                  setFilters({ ...filters, minHp: numValue });
                }}
                min={0}
                disabled={filters.showAllMobs}
              />
              <NumberInput
                label="HP To"
                placeholder="Maximum"
                value={filters.maxHp ?? ''}
                onChange={(value) => {
                  const numValue = typeof value === 'string' ? 
                    (value === '' ? undefined : Number(value)) : 
                    value;
                  setFilters({ ...filters, maxHp: numValue });
                }}
                min={0}
                disabled={filters.showAllMobs}
              />
            </>
          ) : (
            <NumberInput
              label="Exact HP"
              placeholder="Enter HP"
              value={filters.minHp ?? ''}
              onChange={(value) => {
                const numValue = typeof value === 'string' ? 
                  (value === '' ? undefined : Number(value)) : 
                  value;
                setFilters({
                  ...filters, 
                  minHp: numValue,
                  maxHp: filters.useHpRange ? filters.maxHp : undefined,
                });
              }}
              min={0}
              disabled={filters.showAllMobs}
            />
          )}
        </Group>
        <Checkbox
          label="Use HP Range"
          checked={filters.useHpRange}
          onChange={(e) => setFilters({ ...filters, useHpRange: e.currentTarget.checked })}
          disabled={filters.showAllMobs}
        />

        {/* Location Filter */}
        <Select
          label="Location"
          placeholder="Select location"
          data={sortedLocations.map(location => ({ value: location, label: location }))}
          value={filters.location}
          onChange={(value) => setFilters({ ...filters, location: value || '' })}
          clearable
        />

        {/* Mob Type Filter */}
        <Select
          label="Mob Type"
          placeholder="Select type"
          data={mobTypeOptions}
          value={filters.mobType}
          onChange={(value) => setFilters({ ...filters, mobType: value || '' })}
          clearable
        />

        {/* Damage Type Filter */}
        <Select
          label="Damage Type"
          placeholder="Select damage type"
          data={damageTypes.map(damage => ({ value: damage, label: damage }))}
          value={filters.mobDamage} // Default value is "All"
          onChange={(value) => setFilters({ ...filters, mobDamage: value || 'All' })} // Reset to "All" if cleared
          clearable
        />
        <Checkbox
          label="Exclusive Damage Type"
          checked={filters.exclusiveDamageType}
          onChange={(e) => setFilters({ ...filters, exclusiveDamageType: e.currentTarget.checked })}
        />

        {/* Combat Type Filter */}
        <Select
          label="Mob Combat Type"
          placeholder="Select combat type"
          data={combatTypeOptions}
          value={filters.mobCombat}
          onChange={(value) => setFilters({ ...filters, mobCombat: value || 'All' })}
          clearable
        />

        {/* Apply and Reset Buttons */}
        <Group grow>
          <Button onClick={handleApply}>Apply Filters</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default MobFilterUI;