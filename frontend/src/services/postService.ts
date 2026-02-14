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
    likes: string[]; // Array of user IDs
    createdAt: string;
}

export const postService = {
    async getAllPosts(page: number = 1, limit: number = 20): Promise<{ data: Post[]; pagination: any }> {
        try {
            const response = await apiClient.get('/posts', {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    async getMyPosts(): Promise<Post[]> {
        try {
            const response = await apiClient.get<{ data: Post[] }>('/posts/my-posts');
            return response.data.data || [];
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

    async deletePost(id: string) {
        const response = await apiClient.delete(`/posts/${id}`);
        return response.data;
    },

    async uploadMedia(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/upload/post-media', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
