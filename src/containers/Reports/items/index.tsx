import { Button, Container, Group, Modal, Stack, Table, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { url } from '../../../config/url'
import { useAuthProvider } from '../../../provider/AuthProvider'
import { getAuthToken } from '../../../utils'

interface ItemReports {
    "id": string,
    item: {
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
    }
}
const useItemReports = () => {
    return useQuery({
        queryKey: ["IS/ITEM/REPORTS"],
        queryFn: async () => {
            const { data } = await axios.get(`${url}/api/v1/report/items/read/1`, {
                headers: {
                    "authorization": `Bearer ${getAuthToken()}`
                }
            })
            return data.itemReports as ItemReports[]
        }
    })
}



const ItemReports = () => {
    const { data, isLoading } = useItemReports()
    console.log(data);
    const rows = (data || []).map((element) => (
        <ItemRow item={element} key={element.id} />
    ));
    return (
        <Container>
            <Stack>
                <Group>

                    <Title color={"white"}>
                        Item Reports
                    </Title>
                </Group>
                <Table>
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Images</th>
                            <th>More Details</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Stack>
        </Container>
    )
}
const ItemRow = ({ item }: { item: ItemReports }) => {
    const navigate = useNavigate()
    return <><tr>
        <td>{item.id}</td>
        <td>{item.item.itemName}</td>
        <td>{item.item.itemPrice}</td>
        <td>{item.item.itemQuantity}</td>
        <td>{(item.item?.images || []).length} Images</td>
        <td><Button
            onClick={() => {
                navigate(`/dashboard/reports/items/${item.item.id}`)
            }}
        >
            Details
        </Button>
        </td>
    </tr>

    </>
}

export default ItemReports
