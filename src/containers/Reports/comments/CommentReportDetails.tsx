import React, { useState } from 'react'
import { Badge, Button, Checkbox, Container, Flex, Group, Image, Paper, Stack, Text, Title } from '@mantine/core'
import { IconChevronLeft } from '@tabler/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { useNavigate, useParams } from 'react-router-dom'
import { url } from '../../../config/url'
import { getAuthToken } from '../../../utils'
import { showNotification } from '@mantine/notifications'
type CommentReporDetailsType = {
    "id": string,
    "report": string,
    "isReportControlled": boolean,
    "isApproved": null,
    "createdAt": string,
    "updatedAt": string,
    "deletedAt": null,
    "reportedComment": {
        "id": string,
        "comment": string,
        "likes": number,
        "dislikes": number,
        "createdAt": string,
        "updatedAt": string,
        "deletedAt": null,
        "commentImages": any[]
    },
    "reporterUser": null,
    "reporterInfluencer": {
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
    "admin": null
}
const useCommentInspect = (commentId: string) => {
    const q = useQueryClient()
    return useMutation({
        mutationKey: ["IS/COMMENT/REPORT/INSPECT", commentId],
        mutationFn: async ({ commentId, approved }: { commentId: string, approved: boolean }) => {
            const { data } = await axios.post(`${url}/api/v1/report/comment/inspect`, {
                "commentId": commentId,
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
            q.invalidateQueries(["IS/COMMENT/REPORT", commentId])

        },
        onError: () => {
            showNotification({
                title: "Item Report Inspect Error",
                message: "An error occured while inspecting item report",
            })
        }
    })
}
const useCommentReport = (commentId: string | undefined, enabled: boolean, approved: boolean, controlled: boolean) => {
    let queryString = "?"
    if (approved) {
        queryString += "isApproved=true&"
    }
    if (controlled) {
        queryString += "isControlled=true"
    }
    return useQuery({
        queryKey: ["IS/COMMENT/REPORT", commentId],
        queryFn: async () => {
            const { data } = await axios.get(`${url}/api/v1/report/comment/read/${commentId}/1${queryString}`, {
                headers: {
                    "authorization": `Bearer ${getAuthToken()}`
                }
            })
            return data.commentReports as CommentReporDetailsType[]
        },
        enabled: enabled
    })
}
const CommentReportDetails = () => {
    const params = useParams<{ id: string }>()
    const [controlled, setControlled] = useState(false)
    const [approved, setApproved] = useState(false)
    const { data, isLoading } = useCommentReport(params.id, params.id !== undefined, approved, controlled)
    const navigate = useNavigate()
    console.log(data);

    return (
        <Container>
            <Stack>
                <Group position='apart'>
                    <Flex direction={"row"} align="center">
                        <IconChevronLeft color='white' size={32} onClick={() => navigate("/dashboard/reports/comments")} />
                        <Title color={"white"}>

                            Reports Of Comment
                        </Title>
                    </Flex>

                    <Group>
                        <Checkbox checked={approved} onChange={(e) => setApproved(e.target.checked)} label='Show Approved' />
                        <Checkbox checked={controlled} onChange={(e) => setControlled(e.target.checked)} label='Show Controlled' />
                    </Group>
                </Group>
                {
                    (data || []).map(item => <CommentCard comment={item} key={item.id} />)
                }
            </Stack>
        </Container>
    )
}

export default CommentReportDetails
const CommentCard = ({ comment }: { comment: CommentReporDetailsType }) => {

    const { mutate, isLoading } = useCommentInspect(comment.reportedComment.id)
    return <Paper withBorder p={"md"}>
        <Flex direction={"row"} gap="md" align={"center"}>

            <Flex gap={"xs"} direction="column" style={{ flexGrow: 1 }}>
                <Group>
                    <Badge>
                        {comment.isApproved ? "Approved" : "Not Approved"}
                    </Badge>
                    <Badge>
                        {comment.isReportControlled ? "Controlled" : "Not Controlled"}
                    </Badge>
                    <Badge>
                        {comment.report}
                    </Badge>
                </Group>


                <Text>
                    {comment.reportedComment.comment}
                </Text>
            </Flex>
            {
                comment.isReportControlled ? null : <Stack>
                    <Button
                        loading={isLoading}
                        onClick={() => mutate({ commentId: comment.reportedComment.id, approved: true })}
                    >
                        Approve
                    </Button>
                    <Button
                        loading={isLoading}
                        onClick={() => mutate({ commentId: comment.reportedComment.id, approved: false })}
                        color={"red"}
                    >
                        Reject
                    </Button>
                </Stack>
            }
        </Flex>
    </Paper>
}