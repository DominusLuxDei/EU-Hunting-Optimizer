import { Stack, Title, Text } from '@mantine/core';

interface TitleDescription {
  title: string;
  description: string;
}

const TitleDescription = ({ title, description }: TitleDescription) => {
  return (
    <Stack gap="sm" mb="xl">
      <Title order={2}>{title}</Title>
      <Text color="dimmed">{description}</Text>
    </Stack>
  );
};

export default TitleDescription;