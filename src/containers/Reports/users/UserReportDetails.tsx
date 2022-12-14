import { Badge, Button, Checkbox, Container, Flex, Grid, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconChevronLeft } from '@tabler/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { url } from '../../../config/url'
import { getAuthToken } from '../../../utils'
type UserReport = {
    "id": string,
    "report": string,
    "isReportControlled": boolean,
    "isApproved": null,
    "createdAt": string,
    "updatedAt": string,
    "deletedAt": null,
    "reportedUser": {
        "id": string,
        "username": string,
        "birthDate": null,
        "realName": null,
        "email": string,
        "password": string,
        "imageLocation": null,
        "phoneNumber": null,
        "facebookLink": null,
        "instagramLink": null,
        "twitterLink": null,
        "youtubeLink": null,
        "tiktokLink": null,
        "twitchLink": null,
        "personalWebsiteLink": null,
        "created_at": string,
        "updated_at": string,
        "deleted_at": null
    },
    "reporterUser": {
        "id": string,
        "username": string,
        "birthDate": null,
        "realName": null,
        "email": string,
        "password": string,
        "imageLocation": null,
        "phoneNumber": null,
        "facebookLink": null,
        "instagramLink": null,
        "twitterLink": null,
        "youtubeLink": null,
        "tiktokLink": null,
        "twitchLink": null,
        "personalWebsiteLink": null,
        "created_at": string,
        "updated_at": string,
        "deleted_at": null
    },
    "reporterInfluencer": null,
    "admin": null
}
const useUserInspect = (username: string) => {
    const q = useQueryClient()
    return useMutation({
        mutationKey: ["IS/USER/REPORT/INSPECT", username],
        mutationFn: async ({ username, approved }: { username: string, approved: boolean }) => {
            const { data } = await axios.post(`${url}/api/v1/report/user/inspect`, {
                username,
                "isApprove": approved
            }, {
                headers: {
                    "authorization": `Bearer ${getAuthToken()}`
                }
            })
        },
        onSuccess: () => {
            showNotification({
                title: "User Report Inspected",
                message: "User report has been inspected successfully",
            })
            q.invalidateQueries(["IS/USER/REPORT", username])

        },
        onError: () => {
            showNotification({
                title: "User Report Inspect Error",
                message: "An error occured while inspecting User report",
            })
        }
    })
}
const useUserReport = (userId: string | undefined, enabled: boolean, approved: boolean, controlled: boolean) => {
    let queryString = "?"
    if (approved) {
        queryString += "isApproved=true&"
    }
    if (controlled) {
        queryString += "isControlled=true"
    }
    return useQuery({
        queryKey: ["IS/USER/REPORT", userId, approved, controlled],
        queryFn: async () => {
            const { data } = await axios.get(`${url}/api/v1/report/user/read/${userId}/1${queryString}`, {
                headers: {
                    "authorization": `Bearer ${getAuthToken()}`
                }
            })
            return data.userReports as UserReport[]
        },
        enabled: enabled
    })
}
const UserReportDetails = () => {
    const params = useParams<{ id: string }>()
    const [controlled, setControlled] = useState(false)
    const [approved, setApproved] = useState(false)
    const { data, isLoading } = useUserReport(params.id, params.id !== undefined, approved, controlled)
    console.log(data);
    const navigate = useNavigate()

    return (
        <Container>
            <Stack>
                <Group position='apart'>
                    <Flex direction={"row"} align="center">
                        <IconChevronLeft color='white' size={32} onClick={() => navigate("/dashboard/reports/users")} />
                        <Title color={"white"}>

                            Reports Of User
                        </Title>
                    </Flex>

                    <Group>
                        <Checkbox checked={approved} onChange={(e) => setApproved(e.target.checked)} label='Show Approved' />
                        <Checkbox checked={controlled} onChange={(e) => setControlled(e.target.checked)} label='Show Controlled' />
                    </Group>
                </Group>
                {
                    (data || []).map((user, index) => <UserCard key={index} user={user} />)
                }
            </Stack>
        </Container>
    )
}

export default UserReportDetails

const UserCard = ({ user }: { user: UserReport }) => {
    const { mutate, isLoading } = useUserInspect(user.id)
    return <Paper withBorder p={"md"}>
        <Flex direction={"row"} gap="md" align={"center"}>

            <Flex gap={"xs"} direction="column" style={{ flexGrow: 1 }}>
                <Group>
                    <Badge>
                        {user.isApproved ? "Approved" : "Not Approved"}
                    </Badge>
                    <Badge>
                        {user.isReportControlled ? "Controlled" : "Not Controlled"}
                    </Badge>
                </Group>
                <Title order={3}>
                    {user.reportedUser.username}
                </Title>

                <Text>
                    {user.reportedUser.email}
                </Text>
            </Flex>
            {
                user.isReportControlled ? null : <Stack>
                    <Button
                        loading={isLoading}
                        onClick={() => mutate({ username: user.reportedUser.username, approved: true })}
                    >
                        Approve
                    </Button>
                    <Button
                        loading={isLoading}
                        onClick={() => mutate({ username: user.reportedUser.username, approved: false })}
                        color={"red"}
                    >
                        Reject
                    </Button>
                </Stack>
            }
        </Flex>
    </Paper>
}