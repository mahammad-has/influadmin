import { ActionIcon, AppShell, Avatar, ColorScheme, createStyles, Group, Header, Menu, Navbar, Text, Title, UnstyledButton, useMantineColorScheme } from '@mantine/core'
import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { NavigationBar } from '../../Components/Navbar';
import { useDisclosure } from '@mantine/hooks';
import {
    IconLogout,
    IconHeart,
    IconStar,
    IconMessage,
    IconSettings,
    IconPlayerPause,
    IconTrash,
    IconSwitchHorizontal,
    IconChevronDown,
} from '@tabler/icons';
import { ColorMode } from '../../Components/ColorMode';
const user = {
    "name": "User",
    "email": "user@user.com",
    "image": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
}

const useStyles = createStyles((theme) => ({
    header: {
        paddingTop: theme.spacing.sm,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]
            }`,
        marginBottom: 120,
    },

    mainSection: {
        paddingBottom: theme.spacing.sm,
    },

    user: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.sm,
        transition: 'background-color 100ms ease',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        },

        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('xs')]: {
            display: 'none',
        },
    },

    userActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },

    tabs: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    tabsList: {
        borderBottom: '0 !important',
    },

    tab: {
        fontWeight: 500,
        height: 38,
        backgroundColor: 'transparent',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        },

        '&[data-active]': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
        },
    },
}));
export const Dashboard = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const { classes, theme, cx } = useStyles();
    const [opened, { toggle }] = useDisclosure(false);
    return (
        <AppShell
            padding="md"
            navbar={<NavigationBar />}
            header={<Header height={60} p="xs">
                <Group position='apart'>
                    <Title color={"blue"}>
                        Influadmin
                    </Title>
                    <Group>
                        <ColorMode />
                        <Menu
                            width={260}
                            position="bottom-end"
                            transition="pop-top-right"
                            onClose={() => setUserMenuOpened(false)}
                            onOpen={() => setUserMenuOpened(true)}
                        >
                            <Menu.Target>
                                <UnstyledButton
                                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                                >
                                    <Group spacing={7}>
                                        <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
                                        <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                                            {user.name}
                                        </Text>
                                        <IconChevronDown size={12} stroke={1.5} />
                                    </Group>
                                </UnstyledButton>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Label>Settings</Menu.Label>
                                <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>Account settings</Menu.Item>

                                <Menu.Item component={Link} to="/" icon={<IconLogout size={14} stroke={1.5} />}>Logout</Menu.Item>

                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </Header>}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <Outlet />
        </AppShell>
    )
}
