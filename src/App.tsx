import { Box } from "@mantine/core";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import Layout from "./components/Layout";
import CodexOptimizerPage from "./components/CodexOptimizerPage"; // Corrected import path

const App = () => {
  return (
    <Box>
      <Routes>
        {/* Route for the main page */}
        <Route path="/" element={<Layout />} />

        {/* Route for the Codex Optimizer page */}
        <Route path="/EU-Codex-Optimizer" element={<CodexOptimizerPage />} />
      </Routes>
    </Box>
  );
};

export default App;