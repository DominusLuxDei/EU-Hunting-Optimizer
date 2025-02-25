import { useState, useEffect } from 'react';
import { TextInput, Grid, Box, Paper, Text } from '@mantine/core';
import Papa from 'papaparse';

interface CreatureData {
  name: string;
  cycleCosts: number[];
  rewards: number[];
}

interface LocationData {
  location: string;
  creatures: CreatureData[];
}

const CodexOptimizer = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});

  // Load CSV data
  useEffect(() => {
    const loadCSVData = async () => {
      const csvFiles = [
        '/EU-Hunting-Optimizer/Codex - Arkadia.csv',
        '/EU-Hunting-Optimizer/Codex - Calypso_CP_Foma_Monria_Space.csv',
        '/EU-Hunting-Optimizer/Codex - Cyrene.csv',
        '/EU-Hunting-Optimizer/Codex - Next Island_Ancient Greece.csv',
        '/EU-Hunting-Optimizer/Codex - Toulan.csv',
      ];

      const locationData: LocationData[] = [];

      for (const file of csvFiles) {
        const response = await fetch(file);
        const text = await response.text();
        const result = Papa.parse(text, { header: true });

        const creatures: CreatureData[] = result.data.map((row: any) => ({
          name: row['Mob Name'],
          cycleCosts: [
            parseFloat((row['1'] || '0').replace(',', '.')),
            parseFloat((row['2'] || '0').replace(',', '.')),
            parseFloat((row['3'] || '0').replace(',', '.')),
            parseFloat((row['4'] || '0').replace(',', '.')),
            parseFloat((row['5'] || '0').replace(',', '.')),
          ],
          rewards: [
            parseFloat((row['1 Reward'] || '0').replace(',', '.')),
            parseFloat((row['2 Reward'] || '0').replace(',', '.')),
            parseFloat((row['3 Reward'] || '0').replace(',', '.')),
            parseFloat((row['4 Reward'] || '0').replace(',', '.')),
            parseFloat((row['5 Reward'] || '0').replace(',', '.')),
          ],
        }));

        const locationName = file.split(' - ')[1].split('.')[0];
        locationData.push({ location: locationName, creatures });
      }

      // Sort locations alphabetically
      locationData.sort((a, b) => a.location.localeCompare(b.location));
      setLocations(locationData);
    };

    loadCSVData();
  }, []);

  // Handle user input changes
  const handleInputChange = (creatureName: string, value: string) => {
    // Only allow numbers and decimal points
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    setUserInputs((prev) => ({ ...prev, [creatureName]: sanitizedValue }));
  };

  // Calculate cost to reach the next Meta rank (every 5 ranks)
  const calculateCost = (creature: CreatureData, currentRank: number, progress: number) => {
    const nextMetaRank = Math.ceil(currentRank / 5) * 5;
    const ranksToNextMeta = nextMetaRank - currentRank;

    if (ranksToNextMeta <= 0) return 0;

    let totalCost = 0;
    for (let i = currentRank; i < nextMetaRank; i++) {
      const cycleIndex = i % 5;
      totalCost += creature.cycleCosts[cycleIndex];
    }

    // Adjust for progress
    if (progress > 0) {
      const currentCycleIndex = currentRank % 5;
      totalCost -= creature.cycleCosts[currentCycleIndex] * (progress / 100);
    }

    return totalCost;
  };

  return (
    <Box>
      {locations.map((location) => (
        <Box key={location.location} mb="xl">
          {/* Use a Box to center the Text component */}
          <Box style={{ textAlign: 'center' }} mb="md">
            <Text size="xl" fw={700}>
              {location.location}
            </Text>
          </Box>

          <Grid gutter="md">
            {location.creatures.map((creature) => (
              <Grid.Col key={creature.name} span={1.5}> {/* 8 columns per row (12 / 8 = 1.5) */}
                <Paper p="sm" shadow="sm" style={{ textAlign: 'center' }}>
                  <Text mb="sm" fw={500}>{creature.name}</Text>
                  <TextInput
                    type="text"
                    placeholder="Rank.Progress (e.g., 17.8)"
                    value={userInputs[creature.name] || '0'}
                    onChange={(e) => handleInputChange(creature.name, e.target.value)}
                    style={{ width: '100%' }}
                  />
                  {userInputs[creature.name] && (
                    <Text mt="sm" size="sm">
                      Cost to next Meta rank: {calculateCost(
                        creature,
                        parseFloat(userInputs[creature.name].split('.')[0]),
                        parseFloat(userInputs[creature.name].split('.')[1]) || 0
                      ).toFixed(2)} PED
                    </Text>
                  )}
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default CodexOptimizer;