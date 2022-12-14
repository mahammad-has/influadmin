import { Navbar, Group, Code, ScrollArea, createStyles } from '@mantine/core';
import {
    IconNotes,
    IconCalendarStats,
    IconGauge,
    IconPresentationAnalytics,
    IconFileAnalytics,
    IconAdjustments,
    IconLock,
} from '@tabler/icons';
import { LinksGroup } from './LinksGroup';

const isRoot = localStorage.getItem("isRoot")
const mockdata = [
    {
        label: 'Dashboard',
        icon: IconGauge,
        initiallyOpened: true,
        links: [
            { label: 'Dashboard', link: '/' },
        ],
    },
    {
        label: 'Reports',
        icon: IconFileAnalytics,
        links: [
            { label: 'Item Reports', link: '/reports/items' },
            { label: 'Comments Reports', link: '/reports/comments' },
            { label: 'User Reports', link: '/reports/users' },
            { label: 'Influencer Reports', link: '/reports/influencers' },
        ],
    },
    {
        label: 'Admins',
        icon: IconLock,
        initiallyOpened: true,
        links: [
            { label: 'Admin List', link: '/admins' },
        ],
    }
];
const mockNotRootData = [
    {
        label: 'Dashboard',
        icon: IconGauge,
        initiallyOpened: true,
        links: [
            { label: 'Dashboard', link: '/' },
        ],
    },
    {
        label: 'Reports',
        icon: IconFileAnalytics,
        links: [
            { label: 'Item Reports', link: '/reports/items' },
            { label: 'Comments Reports', link: '/reports/comments' },
            { label: 'User Reports', link: '/reports/users' },
            { label: 'Influencer Reports', link: '/reports/influencers' },
        ],
    }
];


const useStyles = createStyles((theme) => ({
    navbar: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        paddingBottom: 0,
    },

    header: {
        padding: theme.spacing.md,
        paddingTop: 0,
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
    },

    links: {
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md,
    },

    linksInner: {
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
    },

    footer: {
        marginLeft: -theme.spacing.md,
        marginRight: -theme.spacing.md,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
    },
}));

export function NavigationBar() {
    const { classes } = useStyles();
    const links = (!isRoot ? mockdata : mockNotRootData).map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <Navbar height={"full"} width={{ sm: 300 }} p="md" className={classes.navbar}>
            <Navbar.Section grow className={classes.links} component={ScrollArea}>
                <div className={classes.linksInner}>{links}</div>
            </Navbar.Section>


        </Navbar>
    );
}