import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { ROUTES } from "../../utils/routes";
import { HiDotsHorizontal } from "react-icons/hi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { deletePost } from "../../services/posts";
import ConfirmModal from "../ConfirmModal";
import { featureHidden } from "../../utils/appProperty";

interface IPostMenuProps {
  postId: number;
  postUserId: string;
  image_urls: string[];
}

const PostMenu = ({ postId, postUserId, image_urls }: IPostMenuProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { mutate: deleteMutate, isPending } = useMutation({
    mutationFn: () => deletePost(image_urls, postId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
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
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteMutate();
    setShowDeleteConfirm(false);
  };

  const handleEdit = () => {
    setOpen(false);

    navigate(`/post/${postId}/edit`);
  };

  return (
    <div className="relative">
      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete post?"
        message="This action cannot be undone."
        confirmText="Delete"
        loading={isPending}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

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
        <div className=" absolute right-0 top-10 z-50 w-36 rounded-xl border border-slate-700 bg-slate-900 shadow-xl overflow-hidden">
          <button
            type="button"
            hidden={featureHidden}
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
