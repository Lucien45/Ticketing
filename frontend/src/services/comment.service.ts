import Axios from "../api/axios";
import type { Comment } from "../types";

export interface CreateCommentPayload {
  content: string;
  ticketId: string;
  authorId: string;
}

async function fetchCommentsByTicket(ticketId: string): Promise<Comment[]> {
  const { data } = await Axios.get<Comment[]>('/comment', {
    params: { ticketId },
  });
  return data;
}

async function createComment(payload: CreateCommentPayload): Promise<Comment> {
  const { data } = await Axios.post<Comment>('/comment', payload);
  return data;
}

export const CommentService = {
    fetchCommentsByTicket, createComment
}