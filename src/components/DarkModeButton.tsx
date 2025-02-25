import { ActionIcon, Flex } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
import { useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";

const DarkModeButton = () => {
  const [value, toggle] = useToggle(['dark', 'light']);
  const { setColorScheme, clearColorScheme } = useMantineColorScheme();

  useEffect(() => {
    value === 'dark' ? setColorScheme('dark') : setColorScheme('light');
  }, [value]);

  return (
    <Flex justify={'flex-end'} w={'100%'}>
      <ActionIcon
        variant={'transparent'}
        color={value === 'light' ? 'gray' : 'yellow'}
        size={'xl'}
        onClick={() => toggle()}
      >
        {value === 'light' ? <IconMoonFilled size={36} /> : <IconSunFilled size={36} />}
      </ActionIcon>
    </Flex>
  );
};

export default DarkModeButton;