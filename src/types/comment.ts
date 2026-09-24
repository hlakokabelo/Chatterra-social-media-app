
export interface INewComment {
  content: string;
  parent_comment_id: number | null;
}

export interface IComment {
  post_id: number;
  user_id: string;
  content: string;
  parent_comment_id: number | null;
  created_at: string;
  id: number;
  username?: string;
  is_deleted?: boolean;
}

export type ICommentChild = IComment & { children?: IComment[] };


export interface IReplyComment {
  content: string;
  parent_comment_id: number | null;
}

export interface IVote {
  id: number;
  post_id?: number;
  comment_id?: number;
  user_id: string;
  vote: number;
}
