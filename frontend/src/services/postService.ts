import apiClient, { getErrorMessage } from "../lib/apiConfig";

export interface Post {
    _id: string;
    userId: {
        _id: string;
        name: string;
        role: string;
        profilePhoto?: string;
        email?: string;
        phoneNumber?: string;
        isContactHidden?: boolean;
    };
    content: string;
    contactDetail?: string;
    email?: string;
    phoneNumber?: string;
    resume?: string;
    images?: string[];
    likes: string[];
    comments: any[];
    createdAt: string;
}

export const postService = {
    async getAllPosts(): Promise<Post[]> {
        try {
            const response = await apiClient.get<{ data: Post[] }>("/posts");
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async createPost(
        content: string,
        contactDetail?: string,
        images?: string[],
        email?: string,
        phoneNumber?: string,
        resume?: string
    ): Promise<Post> {
        try {
            const response = await apiClient.post<{ data: Post }>("/posts", {
                content,
                contactDetail,
                images,
                email,
                phoneNumber,
                resume
            });
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async likePost(id: string): Promise<number> {
        try {
            const response = await apiClient.post<{ likes: number }>(`/posts/${id}/like`);
            return response.data.likes;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async deletePost(id: string): Promise<void> {
        try {
            await apiClient.delete(`/posts/${id}`);
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};
