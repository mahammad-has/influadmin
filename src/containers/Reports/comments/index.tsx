import { Button, Container, Group, Stack, Table, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { url } from '../../../config/url'
import { getAuthToken } from '../../../utils'
type CommentReportType = {
  "id": string,
  "reportedComment": {
    "id": string,
    "comment": string,
    "likes": number,
    "dislikes": number,
    "createdAt": string,
    "updatedAt": string,
    "deletedAt": null,
    "commentImages": any[]
  }
}
const useCommentReports = () => {
  return useQuery({
    queryKey: ["IS/COMMENT/REPORTS"],
    queryFn: async () => {
      const { data } = await axios.get(`${url}/api/v1/report/comments/read/1`, {
        headers: {
          "authorization": `Bearer ${getAuthToken()}`
        }
      })
      return data.commentReports as CommentReportType[]
    }
  })
}

const CommentReports = () => {
  const { data, isLoading } = useCommentReports()
  const rows = (data || []).map((element) => (
    <CommentRow comment={element} key={element.id} />
  ));

  return (
    <Container>
      <Stack>
        <Group>

          <Title color={"white"}>
            Comment Reports
          </Title>
        </Group>
        <Table>
          <thead>
            <tr>
              <th>Comment ID</th>
              <th>Comment Name</th>
              <th>Likes</th>
              <th>Dislikes</th>
              <th>More Details</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Stack>
    </Container>
  )
}

export default CommentReports
const CommentRow = ({ comment }: { comment: CommentReportType }) => {
  const navigate = useNavigate()
  return <><tr>
    <td>{comment.id}</td>
    <td>{comment.reportedComment.comment}</td>
    <td>{comment.reportedComment.likes}</td>
    <td>{comment.reportedComment.dislikes}</td>
    <td><Button
      onClick={() => {
        navigate(`/dashboard/reports/comments/${comment.reportedComment.id}`)
      }}
    >
      Details
    </Button>
    </td>
  </tr>

  </>
}