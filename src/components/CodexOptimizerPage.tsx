import { Title, Button, Flex, Container, Box } from '@mantine/core';
import { Link } from 'react-router-dom'; // Import Link for navigation
import DarkModeButton from './DarkModeButton'; // Import the DarkModeButton

const CodexOptimizerPage = () => {
  return (
    <Container fluid p="xl" style={{ minHeight: '100vh' }}>
      {/* Add the Hunting Optimizer button and DarkModeButton in the top row */}
      <Flex justify="space-between" align="center" mb="md">
        <Button
          component={Link}
          to="/" // Navigate to the main page (Hunting Optimizer)
          variant="outline"
          size="lg" // Large size
          style={{ 
            marginLeft: '20px', 
            fontSize: '18px', // Larger font size
            padding: '12px 24px', // More padding
            minWidth: '225px', // Set a minimum width to ensure the text fits
            whiteSpace: 'nowrap', // Prevent text from wrapping
          }}
        >
          Hunting Optimizer
        </Button>
        <DarkModeButton /> {/* Add the DarkModeButton for consistency */}
      </Flex>

      <Box mb="xl" style={{ textAlign: 'center' }}>
        <Title order={1}>Codex Optimizer</Title>
        <p>This is a placeholder for the Codex Optimizer page.</p>
      </Box>
    </Container>
  );
};

export default CodexOptimizerPage;