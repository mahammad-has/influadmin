import { Badge, Button, Checkbox, Container, Flex, Group, Image, Paper, Stack, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconChevronLeft } from '@tabler/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { url } from '../../../config/url'
import { getAuthToken } from '../../../utils'
type ItemReportDetailsType = {
    "id": string,
    "report": string,
    "isReportControlled": boolean,
    "isApproved": null | boolean,
    "createdAt": string,
    "updatedAt": string,
    "item": {
        "id": string,
        "itemName": string,
        "itemQuantity": number,
        "itemDescription": string,
        "itemPrice": string,
        "averageStars": null,
        "totalComments": number,
        "isVisible": boolean,
        "extraFeatures": null,
        "created_at": string,
        "updated_at": string,
        "deleted_at": null,
        "images": any[]
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
const useItemInspect = (itemId: string) => {
    const q = useQueryClient()
    return useMutation({
        mutationKey: ["IS/ITEM/REPORT/INSPECT", itemId],
        mutationFn: async ({ itemId, approved }: { itemId: string, approved: boolean }) => {
            const { data } = await axios.post(`${url}/api/v1/report/item/inspect`, {
                "itemId": itemId,
                "isApprove": approved
            }, {
                headers: {
                    "authorization": `Bearer ${getAuthToken()}`
                }
            })
        },
        onSuccess: () => {
            showNotification({
                title: "Item Report Inspected",
                message: "Item report has been inspected successfully",
            })
            q.invalidateQueries(["IS/ITEM/REPORT", itemId])

        },
        onError: () => {
            showNotification({
                title: "Item Report Inspect Error",
                message: "An error occured while inspecting item report",
            })
        }
    })
}
const useItemReport = (itemId: string | undefined, enabled: boolean, approved: boolean, controlled: boolean) => {
    let queryString = "?"
    if (approved) {
        queryString += "isApproved=true&"
    }
    if (controlled) {
        queryString += "isControlled=true"
    }
    return useQuery({
        queryKey: ["IS/ITEM/REPORT", itemId, approved, controlled],
        queryFn: async () => {
            const { data } = await axios.get(`${url}/api/v1/report/item/read/${itemId}/1${queryString}`, {
                headers: {
                    "authorization": `Bearer ${getAuthToken()}`
                }
            })
            return data.itemReports as ItemReportDetailsType[]
        },
        enabled: enabled
    })
}
const ItemReportDetails = () => {
    const params = useParams<{ id: string }>()
    const [controlled, setControlled] = useState(false)
    const [approved, setApproved] = useState(false)
    const { data, isLoading } = useItemReport(params.id, params.id !== undefined, approved, controlled)
    const navigate = useNavigate()

    return (
        <Container>
            <Stack>
                <Group position='apart'>
                    <Flex direction={"row"} align="center">
                    <IconChevronLeft color='white' size={32} onClick={() => navigate("/dashboard/reports/items")} />
                        <Title color={"white"}>

                            Reports Of Item
                        </Title>
                    </Flex>

                    <Group>
                        <Checkbox checked={approved} onChange={(e) => setApproved(e.target.checked)} label='Show Approved' />
                        <Checkbox checked={controlled} onChange={(e) => setControlled(e.target.checked)} label='Show Controlled' />
                    </Group>
                </Group>
                {
                    (data || []).map(item => <ItemCard item={item} key={item.id} />)
                }
            </Stack>
        </Container>
    )
}

export default ItemReportDetails

const ItemCard = ({ item }: { item: ItemReportDetailsType }) => {
    const { mutate, isLoading } = useItemInspect(item.id)
    return <Paper withBorder p={"md"}>
        <Flex direction={"row"} gap="md" align={"center"}>
            <Image src={item.item?.images?.[0]} width={100} height={100} />
            <Flex gap={"xs"} direction="column" style={{ flexGrow: 1 }}>
                <Group>
                    <Badge>
                        {item.isApproved ? "Approved" : "Not Approved"}
                    </Badge>
                    <Badge>
                        {item.isReportControlled ? "Controlled" : "Not Controlled"}
                    </Badge>
                </Group>
                <Title order={3}>
                    {item?.item?.itemName}
                </Title>
                <Title order={5}>
                    {item?.item?.itemQuantity || 0} Items
                </Title>
                <Text>
                    {item?.item?.itemDescription}
                </Text>
            </Flex>
            {
                item.isReportControlled ? null : <Stack>
                    <Button
                        loading={isLoading}
                        onClick={() => mutate({ itemId: item.item.id, approved: true })}
                    >
                        Approve
                    </Button>
                    <Button
                        loading={isLoading}
                        onClick={() => mutate({ itemId: item.item.id, approved: false })}
                        color={"red"}
                    >
                        Reject
                    </Button>
                </Stack>
            }
        </Flex>
    </Paper>
}