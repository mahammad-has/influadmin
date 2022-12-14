import { Title, useMantineColorScheme } from '@mantine/core'
import React from 'react'

export const PageTitle = ({ title }: { title: string }) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    return (
        <Title color={dark ? "white" : "black"}>
            {title}
        </Title>
    )
}
