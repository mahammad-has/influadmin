import React, { useState } from 'react'
import { Badge, Button, Checkbox, Container, Flex, Group, Image, Paper, Stack, Text, Title } from '@mantine/core'
import { IconChevronLeft } from '@tabler/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { useNavigate, useParams } from 'react-router-dom'
import { url } from '../../../config/url'
import { getAuthToken } from '../../../utils'
import { showNotification } from '@mantine/notifications'
type InfluencerReportDetailsType = {
    "id": string,
    "report": string,
    "isReportControlled": boolean,
    "isApproved": boolean,
    "createdAt": string,
    "updatedAt": string,
    "deletedAt": null,
    "reportedInfluencer": {
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
        "deleted_at": null,
        "themeColor": null,
        "shopDescription": null
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
const useInfuencerInspect = (username: string, id: string) => {
    const q = useQueryClient()
    return useMutation({
        mutationKey: ["IS/COMMENT/REPORT/INSPECT", username],
        mutationFn: async ({ username, approved }: { username: string, approved: boolean }) => {
            const { data } = await axios.post(`${url}/api/v1/report/influencer/inspect`, {
                "username": username,
                "isApprove": approved
            }, {
                headers: {
                    "authorization": `Bearer ${getAuthToken()}`
                }
            })
        },
        onSuccess: () => {
            showNotification({
                title: "Influencer Report Inspected",
                message: "Influencer report has been inspected successfully",
            })
            q.invalidateQueries(["IS/INFLUENCER/REPORT", id])

        },
        onError: () => {
            showNotification({
                title: "Influencer Report Inspect Error",
                message: "An error occured while inspecting Influencer report",
            })
        }
    })
}
const useInfluencerReport = (influencerId: string | undefined, enabled: boolean, approved: boolean, controlled: boolean) => {
    let queryString = "?"
    if (approved) {
        queryString += "isApproved=true&"
    }
    if (controlled) {
        queryString += "isControlled=true"
    }
    return useQuery({
        queryKey: ["IS/INFLUENCER/REPORT", influencerId],
        queryFn: async () => {
            const { data } = await axios.get(`${url}/api/v1/report/influencer/read/${influencerId}/1${queryString}`, {
                headers: {
                    "authorization": `Bearer ${getAuthToken()}`
                }
            })
            return data.influencerReports as InfluencerReportDetailsType[]
        },
        enabled: enabled
    })
}
const InfluencerReportDetails = () => {
    const params = useParams<{ id: string }>()
    const [controlled, setControlled] = useState(false)
    const [approved, setApproved] = useState(false)
    const { data, isLoading } = useInfluencerReport(params.id, params.id !== undefined, approved, controlled)
    const navigate = useNavigate()
    console.log(data);

    return (
        <Container>
            <Stack>
                <Group position='apart'>
                    <Flex direction={"row"} align="center">
                        <IconChevronLeft color='white' size={32} onClick={() => navigate("/dashboard/reports/influencers")} />
                        <Title color={"white"}>

                            Reports Of Influencer
                        </Title>
                    </Flex>

                    <Group>
                        <Checkbox checked={approved} onChange={(e) => setApproved(e.target.checked)} label='Show Approved' />
                        <Checkbox checked={controlled} onChange={(e) => setControlled(e.target.checked)} label='Show Controlled' />
                    </Group>
                </Group>
                {
                    (data || []).map(item => <InfluencerCard influencer={item} key={item.id} />)
                }
            </Stack>
        </Container>
    )
}

export default InfluencerReportDetails
const InfluencerCard = ({ influencer }: { influencer: InfluencerReportDetailsType }) => {

    const { mutate, isLoading } = useInfuencerInspect(influencer.reportedInfluencer.username, influencer.reportedInfluencer.id)
    return <Paper withBorder p={"md"}>
        <Flex direction={"row"} gap="md" align={"center"}>

            <Flex gap={"xs"} direction="column" style={{ flexGrow: 1 }}>
                <Group>
                    <Badge>
                        {influencer.isApproved ? "Approved" : "Not Approved"}
                    </Badge>
                    <Badge>
                        {influencer.isReportControlled ? "Controlled" : "Not Controlled"}
                    </Badge>
                    <Badge>
                        {influencer.report}
                    </Badge>
                </Group>


                <Text>
                    {influencer.reportedInfluencer.username}
                </Text>
            </Flex>
            {
                influencer.isReportControlled ? null : <Stack>
                    <Button
                        loading={isLoading}
                        onClick={() => mutate({ username: influencer.reportedInfluencer.username, approved: true })}
                    >
                        Approve
                    </Button>
                    <Button
                        loading={isLoading}
                        onClick={() => mutate({ username: influencer.reportedInfluencer.username, approved: false })}
                        color={"red"}
                    >
                        Reject
                    </Button>
                </Stack>
            }
        </Flex>
    </Paper>
}