import { Request, Response } from 'express';
import Post from '../models/post.model';
import User from '../models/user.model';
import { AuthRequest } from '../middlewares/auth.middleware';

export class PostController {
    public create = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { content, contactDetail, images, email, phoneNumber, resume } = req.body;
            if (!content) {
                res.status(400).json({ message: 'Content is required' });
                return;
            }

            const newPost = await Post.create({
                userId,
                content,
                contactDetail,
                email,
                phoneNumber,
                resume,
                images
            });

            // Fetch the populated post to return
            const populatedPost = await Post.findById(newPost._id).populate('userId', 'name role profilePhoto');

            res.status(201).json({ message: 'Post created successfully', data: populatedPost });
        } catch (error: any) {
            console.error('Error creating post:', error);
            res.status(500).json({ message: 'Failed to create post', error: error.message });
        }
    };

    public getAll = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const posts = await Post.find()
                .sort({ createdAt: -1 })
                .populate('userId', 'name role profilePhoto email phoneNumber subscriptionExpiry profile');

            // Business Logic: If the requester is an employer, 
            // check if they have an active subscription before showing contact info
            const requesterId = req.user?.id;
            const requesterRole = req.user?.role;

            let hasActiveSubscription = false;
            if (requesterId && (requesterRole === 'employer' || requesterRole === 'recruiter')) {
                const requester = await User.findById(requesterId);
                const now = new Date();
                if (requester?.subscriptionExpiry && new Date(requester.subscriptionExpiry) > now) {
                    hasActiveSubscription = true;
                }
            }

            // Map posts to scrub info if necessary
            const scrubbedPosts = posts.map(post => {
                const postObj = post.toObject();
                const author = postObj.userId as any;

                // Protect employee contact info from unsubscribed employers
                const isRequesterUnsubscribedEmployer = !hasActiveSubscription && (requesterRole === 'employer' || requesterRole === 'recruiter');
                const isAuthorEmployee = author.role === 'employee';

                if (isRequesterUnsubscribedEmployer && isAuthorEmployee) {
                    // Hide sensitive info
                    return {
                        ...postObj,
                        contactDetail: postObj.contactDetail ? 'Contact Information Hidden (Subscription Required)' : undefined,
                        email: postObj.email ? '***@***.com (Subscription Required)' : undefined,
                        phoneNumber: postObj.phoneNumber ? '********** (Subscription Required)' : undefined,
                        resume: postObj.resume ? 'Hidden (Subscription Required)' : undefined,
                        userId: {
                            _id: author._id,
                            name: author.name,
                            role: author.role,
                            profilePhoto: author.profilePhoto,
                            // Scrub these
                            email: '***@***.com (Subscription Required)',
                            phoneNumber: '********** (Subscription Required)',
                            isContactHidden: true
                        }
                    };
                }
                return postObj;
            });

            res.status(200).json({ data: scrubbedPosts });
        } catch (error: any) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
        }
    };

    public like = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const post = await Post.findById(req.params.id);
            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }

            const userIdObj = new (require('mongoose').Types.ObjectId)(userId);
            const likeIndex = post.likes.indexOf(userIdObj);

            if (likeIndex > -1) {
                // Unlike
                post.likes.splice(likeIndex, 1);
            } else {
                // Like
                post.likes.push(userIdObj);
            }

            await post.save();
            res.status(200).json({ message: 'Success', likes: post.likes.length });
        } catch (error: any) {
            res.status(500).json({ message: 'Failed to like/unlike', error: error.message });
        }
    };

    public delete = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const postId = req.params.id;

            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const post = await Post.findById(postId);

            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }

            // Check ownership - only owner or admin can delete
            if (post.userId.toString() !== userId && req.user?.role !== 'admin') {
                res.status(403).json({ message: 'You can only delete your own posts' });
                return;
            }

            await Post.findByIdAndDelete(postId);
            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error: any) {
            console.error('Error deleting post:', error);
            res.status(500).json({ message: 'Failed to delete post', error: error.message });
        }
    };

    public addComment = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const postId = req.params.id;
            const { text } = req.body;

            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            if (!text || !text.trim()) {
                res.status(400).json({ message: 'Comment text is required' });
                return;
            }

            const post = await Post.findById(postId);
            if (!post) {
                res.status(404).json({ message: 'Post not found' });
                return;
            }

            const newComment = {
                userId: new (require('mongoose').Types.ObjectId)(userId),
                text: text.trim(),
                createdAt: new Date()
            };

            post.comments.push(newComment);
            await post.save();

            // Return the updated post with populated comments
            const updatedPost = await Post.findById(postId)
                .populate('userId', 'name role profilePhoto')
                .populate('comments.userId', 'name role profilePhoto');

            res.status(200).json({ message: 'Comment added successfully', data: updatedPost });
        } catch (error: any) {
            console.error('Error adding comment:', error);
            res.status(500).json({ message: 'Failed to add comment', error: error.message });
        }
    };
}
