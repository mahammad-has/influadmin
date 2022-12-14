import { Button, Container, Group, Stack, Table, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { url } from '../../../config/url'
import { getAuthToken } from '../../../utils'
type InfluencerReportType = {
    "id": string,
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
    }
}
const useInfluencerReports = () => {
    return useQuery({
        queryKey: ["IS/INFLUENCER/REPORTS"],
        queryFn: async () => {
            const { data } = await axios.get(`${url}/api/v1/report/influencers/read/1`, {
                headers: {
                    "authorization": `Bearer ${getAuthToken()}`
                }
            })
            return data.influencerReports as InfluencerReportType[]
        }
    })
}

const InfluencerReports = () => {
    const { data, isLoading } = useInfluencerReports()
    const rows = (data || []).map((element) => (
        <InfluencerRow influencer={element} key={element.id} />
    ));

    return (
        <Container>
            <Stack>
                <Group>

                    <Title color={"white"}>
                        Influencer Reports
                    </Title>
                </Group>
                <Table>
                    <thead>
                        <tr>
                            <th>Influencer Report ID</th>
                            <th>Influencer email</th>
                            <th>Influencer Username</th>
                            <th>Influencer Name</th>
                            <th>More Details</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Stack>
        </Container>
    )
}

export default InfluencerReports
const InfluencerRow = ({ influencer }: { influencer: InfluencerReportType }) => {
    const navigate = useNavigate()
    return <><tr>
        <td>{influencer.id}</td>
        <td>{influencer.reportedInfluencer.email}</td>
        <td>{influencer.reportedInfluencer.username}</td>
        <td>{influencer.reportedInfluencer.realName}</td>
        <td><Button
            onClick={() => {
                navigate(`/dashboard/reports/influencers/${influencer.reportedInfluencer.id}`)
            }}
        >
            Details
        </Button>
        </td>
    </tr>

    </>
}