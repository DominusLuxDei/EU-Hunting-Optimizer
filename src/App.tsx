import { Box } from "@mantine/core";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CodexOptimizerPage from "./components/CodexOptimizerPage"; // Updated import

const App = () => {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/EU-Codex-Optimizer" element={<CodexOptimizerPage />} /> {/* Updated to use CodexOptimizerPage */}
      </Routes>
    </Box>
  );
};

export default App;