import { useState } from 'react';
import { Box, Title, Text } from "@mantine/core";
import { CombinedMob } from "./types";
import MobDetailsModal from "./MobDetailsModal";

interface OutputDisplayProps {
  results: CombinedMob[];
}

const OutputDisplay = ({ results }: OutputDisplayProps) => {
  const [selectedMob, setSelectedMob] = useState<CombinedMob | null>(null);

  // Function to filter and display only the damage types that are used
  const getUsedDamageTypes = (damageTypes: string[]) => {
    return damageTypes.filter(dt => {
      const percentage = parseFloat(dt.split(' ')[1]); // Extract the percentage value
      return percentage > 0; // Only include damage types with a percentage greater than 0
    });
  };

  return (
    <Box style={{ width: '100%', maxWidth: '100%' }}>
      <Title order={3} mb="md" style={{ textAlign: 'center' }}>Filtered Results ({results.length})</Title>
      
      {results.length > 0 ? (
        <Box
          style={{
            height: '400px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '8px',
          }}
        >
          {results.map((result, index) => {
            const usedDamageTypes = getUsedDamageTypes(result.damageTypes);

            return (
              <Box
                key={`${result.name}-${index}`}
                p="sm"
                mb="sm"
                style={{
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontSize: '0.85rem',
                }}
                onClick={() => setSelectedMob(result)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  <Text span fw={600} mr={8}>{result.name}</Text>
                  <Text span color="dimmed" mr={8}>[{result.maturity}]</Text>
                  <Text span mr={8}>LVL {result.dangerLevel}</Text>
                  <Text span mr={8}>({result.health.toLocaleString()} HP)</Text>
                  <Text span mr={8} color="blue">({result.hpPerLevel.toFixed(1)} HP/LVL)</Text>
                  {usedDamageTypes.map((dt, i) => (
                    <Text key={i} span color="orange" mr={4}>{dt}</Text>
                  ))}
                </div>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Text c="dimmed" style={{ textAlign: 'center' }}>No results found. Adjust your filters.</Text>
      )}
      
      <MobDetailsModal mob={selectedMob} onClose={() => setSelectedMob(null)} />
    </Box>
  );
};

export default OutputDisplay;