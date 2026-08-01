import { useForm } from "react-hook-form";
import { uploadVideo } from "../../services/videoService.js";
import { useMutation } from '@tanstack/react-query'
import { Container, Input, Button, ButtonLoader } from "../ui/index.js";
import { useNavigate } from "react-router-dom";

function UploadVideo(){

    const { register, handleSubmit } = useForm();

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: uploadVideo
    })

    const uploadHandler = async(data) => {
        const video = data ? {
            title: data.title,
            description: data.description,
            isPublished: data.isPublished,
            videoFile: data.videoFile?.[0],
            thumbnail: data.thumbnail?.[0]
        } : null;

        if (data) {
            mutation.mutate(video, {
                onSuccess: (response) => {
                    console.log("Video Upload with data:", response)
                    setTimeout(()=>{
                        navigate("/")
                    },2000)
                },
                onError: (error) => {
                    console.log("Error uploading video:", error.response?.data)
                }
            })
        }
    }

    if (mutation.error) {
        return (
            <div className="min-h-screen bg-gray-200 px-6 py-10 text-center text-red-400 transition-colors duration-300 dark:bg-gray-950">
                {mutation.error.response?.data?.message || "Unable to upload video."}
            </div>
        )
    }

    if (mutation.isSuccess) {
        return (
            <div className="min-h-screen bg-gray-200 px-6 py-10 text-center text-gray-950 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-200">
                <div className="mx-auto max-w-xl rounded-2xl border border-gray-300 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="text-2xl font-semibold text-gray-950 dark:text-white">Video uploaded successfully</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Redirecting you back home...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-200 px-4 py-4 transition-colors duration-300 dark:bg-gray-950 sm:px-6 lg:px-8">
            <Container>
                <form
                    onSubmit={handleSubmit(uploadHandler)}
                    className="mx-auto w-full max-w-6xl rounded-2xl border border-gray-300 bg-white/90 p-5 shadow-xl shadow-gray-300/50 dark:border-gray-800 dark:bg-gray-900/90 dark:shadow-black/30 sm:p-6 lg:p-8"
                >
                    <div className="mb-6 border-b border-gray-300 pb-4 dark:border-gray-800">
                        <h1 className="text-3xl font-semibold text-gray-950 dark:text-white sm:text-4xl">Upload a video</h1>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Input
                            label="Title"
                            placeholder="Enter a catchy title"
                            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-950 outline-none transition focus:border-red-500 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white"
                            labelClassName="text-sm font-medium text-gray-700 dark:text-gray-300"
                            {...register("title", { required: "Title is required!" })}
                        />

                        <Input
                            label="Description"
                            placeholder="Tell viewers about your video"
                            className="rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-950 outline-none transition focus:border-red-500 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white"
                            labelClassName="text-sm font-medium text-gray-700 dark:text-gray-300"
                            {...register("description", {
                                required: "Description is required!",
                            })}
                        />
                    </div>

                    <div className="mt-6 rounded-2xl border border-gray-300 bg-gray-100/80 p-4 dark:border-gray-800 dark:bg-gray-950/70">
                        <h2 className="mb-4 text-lg font-semibold text-gray-950 dark:text-white">Visibility</h2>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    value="true"
                                    className="peer hidden"
                                    {...register("isPublished", { required: "Required" })}
                                />
                                <span className="block rounded-xl border border-gray-300 bg-white px-5 py-3 text-center font-medium text-gray-700 transition-all hover:border-red-500 hover:bg-gray-100 peer-checked:border-red-500 peer-checked:bg-red-500 peer-checked:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                                    Public
                                </span>
                            </label>

                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    value="false"
                                    className="peer hidden"
                                    {...register("isPublished", { required: "Required" })}
                                />
                                <span className="block rounded-xl border border-gray-300 bg-white px-5 py-3 text-center font-medium text-gray-700 transition-all hover:border-red-500 hover:bg-gray-100 peer-checked:border-red-500 peer-checked:bg-red-500 peer-checked:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                                    Private
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        <Input
                            label="Video file"
                            type="file"
                            className="rounded-xl border border-gray-300 bg-gray-100 px-3 py-3 text-gray-950 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-800 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:file:bg-gray-700 dark:file:text-gray-100"
                            labelClassName="text-sm font-medium text-gray-700 dark:text-gray-300"
                            {...register("videoFile", {
                                required: "Video is required!",
                            })}
                        />

                        <Input
                            label="Thumbnail"
                            type="file"
                            className="rounded-xl border border-gray-300 bg-gray-100 px-3 py-3 text-gray-950 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-800 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:file:bg-gray-700 dark:file:text-gray-100"
                            labelClassName="text-sm font-medium text-gray-700 dark:text-gray-300"
                            {...register("thumbnail", {
                                required: "Thumbnail is required!",
                            })}
                        />
                    </div>
                    <div className="flex justify-center">
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-gray-300 px-5 py-3 text-lg font-semibold text-gray-950 transition hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                        {mutation.isPending ? "Uploading..." : "Upload Video"}
                        {mutation.isPending && <ButtonLoader />}
                    </Button>
                    </div>
                </form>
            </Container>
        </div>
    )
}

export default UploadVideo;