import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { createComment as createCommentService, createReply as createReplyService } from "../../services/commentSevice.js";
import { Button } from "../ui/index.js";

function CreateComment({
  videoId,
  parentCommentId = null,
  onSuccess,
  onError,
  placeholder = "Write a comment...",
  buttonText = "Comment",
  className = "",
  textareaClassName = "",
  buttonClassName = "",
  disabled = false
}) {
  const theme = useSelector((state) => state.theme.theme);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      content: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const content = data.content?.trim();

      if (!content) {
        throw new Error("Comment content is required");
      }

      if (parentCommentId) {
        return createReplyService(parentCommentId, { content });
      }

      if (!videoId) {
        throw new Error("Video ID is required");
      }

      return createCommentService(videoId, { content });
    },
    onSuccess: (response, variables) => {
      reset();
      onSuccess?.(response, variables);
    },
    onError: (error) => {
      onError?.(error);
    }
  });

  const submitHandler = (data) => {
    if (disabled) return;
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={`space-y-3 ${className}`}>
      <div>
        <textarea
          {...register("content", {
            required: "Comment content is required"
          })}
          rows={3}
          placeholder={placeholder}
          disabled={disabled || mutation.isPending}
          className={`w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-red-500 ${theme === 'dark' ? 'border-gray-700 bg-gray-900 text-gray-100' : 'border-gray-300 bg-white text-gray-950'} ${textareaClassName} ${errors.content ? "border-red-500" : ""}`}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      {mutation.error && (
        <p className="text-sm text-red-500">
          {mutation.error.response?.data?.message || mutation.error.message}
        </p>
      )}

      <div className="flex items-center justify-end">
        <Button
          type="submit"
          disabled={disabled || mutation.isPending}
          className={`rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 ${buttonClassName}`}
        >
          {mutation.isPending ? "Posting..." : buttonText}
        </Button>
      </div>
    </form>
  );
}

export default CreateComment;
