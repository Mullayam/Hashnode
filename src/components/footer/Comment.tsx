import { Heart, MessageCircle } from "lucide-react";
import React, { type FC } from "react";
import { type Comment } from "~/types";

interface Props {
  handleLike: () => void;
  comment: Comment;
  like: {
    hasLiked: boolean;
    likesCount: number;
  };
  setShowReply: React.Dispatch<React.SetStateAction<boolean>>;
  replyComment: (data: { id: string; username: string }) => void;
}

const CommentFooter: FC<Props> = ({
  comment,
  handleLike,
  like,
  setShowReply,
  replyComment,
}) => {
  return (
    <div className="flex items-center gap-4 py-2">
      <button
        onClick={handleLike}
        className="btn-icon flex items-center gap-1 p-1"
      >
        <span>
          <Heart
            className={`h-5 w-5 fill-none ${
              like.hasLiked
                ? "fill-red stroke-red"
                : "stroke-border dark:stroke-text-primary"
            }  md:h-6 md:w-6`}
          />
        </span>

        <span className="text-gray-700 dark:text-text-secondary">
          {like.likesCount}
        </span>
      </button>

      <button
        onClick={() => setShowReply((prev) => !prev)}
        className="btn-icon flex items-center gap-1 p-1"
      >
        <span>
          <MessageCircle className="h-6 w-6 fill-none stroke-gray-700 dark:stroke-text-primary" />
        </span>

        <span className="text-gray-700 dark:text-text-secondary">
          {comment.repliesCount}
        </span>
      </button>

      <button
        onClick={() => {
          replyComment({
            id: comment.id,
            username: comment.user.username,
          });
        }}
        className="btn-link"
      >
        Reply
      </button>
    </div>
  );
};

export default CommentFooter;
