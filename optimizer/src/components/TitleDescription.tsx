import { Stack, Title, Text } from '@mantine/core';

interface TitleDescriptionProps {
  title: string;
  description: string;
}

const TitleDescription = ({ title, description }: TitleDescriptionProps) => {
  return (
    <Stack gap="sm" align="center" style={{ textAlign: 'center' }}>
      <Title order={1} style={{ fontSize: '2.5rem' }}>{title}</Title>
      <Text color="dimmed">{description}</Text>
    </Stack>
  );
};

export default TitleDescription;