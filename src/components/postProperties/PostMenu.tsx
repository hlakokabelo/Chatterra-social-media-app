import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../config/supabase-client";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { ROUTES } from "../../utils/routes";
import { HiDotsHorizontal } from "react-icons/hi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

interface IPostMenuProps {
  postId: number;
  postUserId: string;
}


const deletePost = async (postId: number) => {
  const { error } = await supabase.rpc("delete_post", {
    p_post_id: postId,
  });

  if (error) throw new Error(error.message);
};

const PostMenu = ({ postId, postUserId }: IPostMenuProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { mutate: deleteMutate, isPending } = useMutation({
    mutationFn: () => deletePost(postId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post", postId],
      });

      toast.success("Post deleted");

      navigate(ROUTES.HOME);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Don't show the menu for posts the user doesn't own.
  if (!user || user.id !== postUserId) {
    return null;
  }

  const handleDelete = () => {
    setOpen(false);

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    deleteMutate();
  };

  const handleEdit = () => {
    setOpen(false);

    navigate(`/post/${postId}/edit`);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Post options"
        aria-expanded={open}
      >
        <HiDotsHorizontal className="text-xl" />
      </button>

      {open && (
        <div  className="hidden absolute right-0 top-10 z-50 w-36 rounded-xl border border-slate-700 bg-slate-900 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={handleEdit}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <FiEdit2 />
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            <FiTrash2 />
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostMenu;
