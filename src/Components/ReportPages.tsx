import { Container, Grid, Paper, Title } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom'

const ReportPages = () => {
    return (
        <Container>
            <Title color={"white"}>
                Welcome to Influadmin!
            </Title>
            <Grid mt={"md"}>
                <Grid.Col span={6}>
                    <Paper component={Link} to="/dashboard/reports/items" withBorder p="md">
                        <Title order={2}>
                            Item Reports
                        </Title>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Paper component={Link} to="/dashboard/reports/comments" withBorder p="md">
                        <Title order={2}>
                            Comments Reports
                        </Title>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Paper component={Link} to="/dashboard/reports/users" withBorder p="md">
                        <Title order={2}>
                            User Reports
                        </Title>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Paper component={Link} to="/dashboard/reports/influencers" withBorder p="md">
                        <Title order={2}>
                            Influencer Reports
                        </Title>
                    </Paper>
                </Grid.Col>

            </Grid>
        </Container>
    )
}

export default ReportPages