import { Button, Container, Group, Stack, Table, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { url } from '../../../config/url'
import { getAuthToken } from '../../../utils'

type UserReportType = {
    "id": string,
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
    }
}
const useUserReports = () => {
    return useQuery({
        queryKey: ["IS/USER/REPORTS"],
        queryFn: async () => {
            const { data } = await axios.get(`${url}/api/v1/report/users/read/1`, {
                headers: {
                    "authorization": `Bearer ${getAuthToken()}`
                }
            })
            return data.userReports as UserReportType[]
        }
    })
}
const UserReports = () => {
    const { data, isLoading } = useUserReports()
    console.log(data);
    const rows = (data || []).map((element) => (
        <UserRow user={element} key={element.id} />
    ));
    return (
        <Container>
            <Stack>
                <Group>

                    <Title color={"white"}>
                        User Reports
                    </Title>
                </Group>
            </Stack>
            <Table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>User Real Name</th>
                        <th>More Details</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </Container>
    )
}

export default UserReports
const UserRow = ({ user }: { user: UserReportType }) => {
    const navigate = useNavigate()
    return <><tr>
        <td>{user.id}</td>
        <td>{user.reportedUser.username}</td>
        <td>{user.reportedUser.realName}</td>

        <td><Button
            onClick={() => {
                navigate(`/dashboard/reports/users/${user.reportedUser.id}`)
            }}
        >
            Details
        </Button>
        </td>
    </tr>

    </>
}