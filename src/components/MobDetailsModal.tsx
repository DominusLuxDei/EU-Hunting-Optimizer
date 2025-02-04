import { Modal, Text, Stack } from '@mantine/core';
import { CombinedMob } from './types';

interface MobDetailsModalProps {
  mob: CombinedMob | null;
  onClose: () => void;
}

const MobDetailsModal = ({ mob, onClose }: MobDetailsModalProps) => {
  // Function to clean up the type by removing "Investigator"
  const cleanType = (type: string | undefined) => {
    if (!type) return 'N/A';
    return type.replace(/Investigator/g, '').trim();
  };

  return (
    <Modal 
      opened={!!mob} 
      onClose={onClose} 
      title="Mob Details" 
      size="lg"
      overlayProps={{ blur: 3 }}
    >
      {mob && (
        <Stack gap="sm">
          <Text><strong>Name:</strong> {mob.name}</Text>
          <Text><strong>Type:</strong> {cleanType(mob.type)}</Text> {/* Use cleanType here */}
          <Text><strong>Location:</strong> {mob.location}</Text>
          <Text><strong>Maturity:</strong> {mob.maturity}</Text>
          <Text><strong>Health:</strong> {mob.health.toLocaleString()}</Text>
          <Text><strong>Danger Level:</strong> {mob.dangerLevel}</Text>
          <Text><strong>HP/Level:</strong> {mob.hpPerLevel.toFixed(2)}</Text>
          <Text><strong>Movement:</strong> {mob.movement}</Text>
          <Text><strong>Combat:</strong> {mob.combat}</Text>
          <Text><strong>Aggression:</strong> {mob.aggression}</Text>
          <Text><strong>Damage Types:</strong> {mob.damageTypes.join(', ')}</Text>
          {mob.attacksPerMin && (
            <Text><strong>Attacks/Min:</strong> {mob.attacksPerMin}</Text>
          )}
          <Text><strong>Is Event:</strong> {mob.isEvent ? 'Yes' : 'No'}</Text>
          <Text><strong>Is Instance:</strong> {mob.isInstance ? 'Yes' : 'No'}</Text>
        </Stack>
      )}
    </Modal>
  );
};

export default MobDetailsModal;