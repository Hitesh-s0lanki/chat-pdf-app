import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner";

type ResponseType = {}
type RequestType = FormData

export const useCreateChat = () => {
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (formData) => {
            const response = await axios.post("/api/create-chat", formData)
            return response.data
        },
        onSuccess: () => {
            toast.success("Chat created")
        },
        onError: () => {
            toast.error("Failed to create chat")
        }
    })

    return mutation
}