import { Box, Title, Text } from "@mantine/core";

interface OutputDisplayProps {
	results: any[]; // Replace with your actual data structure
}

const OutputDisplay = ({ results }: OutputDisplayProps) => {
	return (
		<Box>
			<Title order={3} mb='md'>Filtered Results</Title>
			{results.length > 0 ? (
				results.map((result, index) => (
					<Box
						key={index}
						mb='sm'
					>
						<Text>
							<strong>Name:</strong> {result.name}
						</Text>
						<Text>
							<strong>HP:</strong> {result.hp}
						</Text>
						<Text>
							<strong>Level:</strong> {result.level}
						</Text>
						<Text>
							<strong>HP/Level Ratio:</strong>
							{(parseFloat(result.hp) / parseFloat(result.level)).toFixed(2)}
						</Text>
						<Text>
							<strong>Location:</strong> {result.location}
						</Text>
						<Text>
							<strong>Type:</strong> {result.type}
						</Text>
						<Text>
							<strong>Damage:</strong> {result.damage}
						</Text>
					</Box>
				))
			) : (
				<Text c='dimmed'>No results to display.</Text>
			)}
		</Box>
	);
};

export default OutputDisplay;
