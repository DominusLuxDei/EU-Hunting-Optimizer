import { Stack, Title, Text } from '@mantine/core';

interface TitleDescriptionProps {
  title: string;
  description: string;
}

const TitleDescription = ({ title, description }: TitleDescriptionProps) => {
  return (
    <Stack gap="xs" align="center">
      <Title order={1} style={{ fontSize: '2.5rem' }}>{title}</Title>
      <Text size="xl" color="dimmed" style={{ textAlign: 'center' }}>{description}</Text>
    </Stack>
  );
};

export default TitleDescription;