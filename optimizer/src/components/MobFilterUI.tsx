import { useState } from 'react';
import { Select, Checkbox, TextInput, Button, Group, Box, NumberInput, Stack } from '@mantine/core';
import { FilterValues } from './types';

interface MobFilterUIProps {
  locations: string[];
  mobTypes: string[];
  damageTypes: string[];
  onApplyFilters: (filters: FilterValues) => void;
}

const MobFilterUI = ({ locations = [], mobTypes = [], damageTypes = [], onApplyFilters }: MobFilterUIProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    mobName: '',
    location: '',
    mobType: '',
    mobDamage: '',
    minHp: undefined,
    maxHp: undefined,
    showAllMobs: true,
    useHpRange: false,
  });

  const handleApply = () => {
    if (filters.useHpRange && filters.minHp && filters.maxHp && filters.minHp > filters.maxHp) {
      alert('Invalid HP Range: Minimum cannot be greater than Maximum');
      return;
    }
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      mobName: '',
      location: '',
      mobType: '',
      mobDamage: '',
      minHp: undefined,
      maxHp: undefined,
      showAllMobs: true,
      useHpRange: false,
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Box p="md">
      <Stack gap="sm">
        <TextInput
          placeholder="Search mob name"
          value={filters.mobName}
          onChange={(e) => setFilters({ ...filters, mobName: e.target.value })}
        />

        <Checkbox
          label="Show all mobs (override filters)"
          checked={filters.showAllMobs}
          onChange={(e) => setFilters({ ...filters, showAllMobs: e.currentTarget.checked })}
        />

        <Group grow>
          {filters.useHpRange ? (
            <>
              <NumberInput
                label="Min HP"
                value={filters.minHp ?? ''}
                onChange={(v) => setFilters({ ...filters, minHp: Number(v) || undefined })}
                min={0}
                disabled={filters.showAllMobs}
              />
              <NumberInput
                label="Max HP"
                value={filters.maxHp ?? ''}
                onChange={(v) => setFilters({ ...filters, maxHp: Number(v) || undefined })}
                min={0}
                disabled={filters.showAllMobs}
              />
            </>
          ) : (
            <NumberInput
              label="Exact HP"
              value={filters.minHp ?? ''}
              onChange={(v) => {
                const value = Number(v) || undefined;
                setFilters({ ...filters, minHp: value, maxHp: value });
              }}
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

        <Select
          label="Location"
          data={locations.map(l => ({ value: l, label: l }))}
          value={filters.location}
          onChange={(v) => setFilters({ ...filters, location: v || '' })}
          clearable
          placeholder="Select location"
        />

        <Select
          label="Mob Type"
          data={['', ...mobTypes].map(t => ({ value: t, label: t || 'All' }))}
          value={filters.mobType}
          onChange={(v) => setFilters({ ...filters, mobType: v || '' })}
          clearable
          placeholder="Select type"
        />

        <Select
          label="Damage Type"
          data={['', ...damageTypes].map(d => ({ value: d, label: d || 'All' }))}
          value={filters.mobDamage}
          onChange={(v) => setFilters({ ...filters, mobDamage: v || '' })}
          clearable
          placeholder="Select damage type"
        />

        <Group grow>
          <Button onClick={handleApply}>Apply Filters</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default MobFilterUI;