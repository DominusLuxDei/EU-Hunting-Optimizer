import { Box, Container, Flex, Grid, Paper } from "@mantine/core";
import { useState, useEffect } from "react"; // Import useEffect
import TitleDescription from "./TitleDescription";
import MobFilterUI from "./MobFilterUI";
import OutputDisplay from "./OutputDisplay";
import Papa from 'papaparse';

const Layout = () => {
	const [filteredResults, setFilteredResults] = useState<any[]>([]);
	const [mobData, setMobData] = useState<any[]>([]); // State to store CSV data

	// Load CSV data on component mount
	useEffect(() => {
        loadFile('mobs.csv');
    }, []);

	async function loadFile(filePath: string) {
        const response = await fetch(filePath);
        const reader = response.body?.getReader();
        const result = await reader?.read();
        const decoder = new TextDecoder('utf-8');
        const csvString = decoder.decode(result?.value);

        Papa.parse(csvString, {
            header: true,
            skipEmptyLines: true,
            complete: (res) => {
                console.log(res)
            }
        })
    }

	const handleFilter = (filters: any) => {
		// Filter the data based on inputs
		const filtered = mobData.filter((mob) => {
			return (
				(!filters.mobName || mob.name.includes(filters.mobName)) &&
				(!filters.location || mob.location === filters.location) &&
				(!filters.mobType || mob.type === filters.mobType) &&
				(!filters.mobDamage || mob.damage === filters.mobDamage) &&
				(!filters.minHp || mob.hp >= filters.minHp) &&
				(!filters.maxHp || mob.hp <= filters.maxHp)
			);
		});

		// Sort by hp/lvl ratio (lower is better)
		const sorted = filtered.sort((a, b) => {
			const ratioA = parseFloat(a.hp) / parseFloat(a.level);
			const ratioB = parseFloat(b.hp) / parseFloat(b.level);
			return ratioA - ratioB;
		});

		setFilteredResults(sorted);
	};

	return (
		<Container size={'xl'} p={'xl'}>
			{/* Title and Description in the Center */}
			<Box style={{ marginBottom: "40px" }}>
				<TitleDescription
					title='Mob Filter UI'
					description='Use this interface to filter mobs by name, HP, location, type, and damage type.'
				/>
			</Box>
            <Paper withBorder p={'xl'}>
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        {/* MobFilterUI on the Left */}
                        <Flex justify={'center'}>
                            <MobFilterUI  />
                        </Flex>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        {/* OutputDisplay on the Right */}
                        <Flex justify={'center'}>
                            <OutputDisplay results={filteredResults} />
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Paper>
		</Container>
	);
};

export default Layout;
