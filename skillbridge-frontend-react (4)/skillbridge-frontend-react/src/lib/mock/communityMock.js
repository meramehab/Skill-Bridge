/**
 * @file communityMock.js
 * @description Mock data for the social Community layer (Posts, Likes, Comments, Optimistic UI).
 */
import { simulateNetworkDelay } from "../../utils/asyncUtils";

export const MOCK_POSTS_DATABASE = [
  {
    id: "post_301",
    author: {
      id: "std_10293",
      name: "أحمد محمود",
      university: "جامعة القاهرة",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120"
    },
    content: "الحمد لله، نجحت اليوم في اجتياز تقييم مهارة React على SkillBridge بنسبة 95% وأصبح حسابي مؤهلاً لسوق العمل الحر! أنصح الجميع بالتركيز على الـ Custom Hooks والـ State Management.",
    codeSnippet: "const useAsyncState = (asyncFn, deps) => { ... }",
    mediaUrl: null,
    likesCount: 24,
    commentsCount: 5,
    isLikedByMe: false,
    createdAt: "2026-08-27T18:30:00Z"
  },
  {
    id: "post_302",
    author: {
      id: "std_40591",
      name: "مريم إيهاب",
      university: "جامعة عين شمس",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
    },
    content: "فريقنا (Squad Alpha) شغال على مشروع تخرج وحصلنا على أول Micro Gig من خلال المنصة! مين هنا بيشتغل بـ Tailwind v3 يشاركنا أفضل إضافات؟",
    codeSnippet: null,
    mediaUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
    likesCount: 42,
    commentsCount: 11,
    isLikedByMe: true,
    createdAt: "2026-08-26T21:15:00Z"
  }
];

export const MOCK_COMMENTS_DATABASE = {
  post_301: [
    {
      id: "comm_1",
      postId: "post_301",
      author: { id: "std_889", name: "محمود حسن", university: "جامعة حلوان" },
      content: "ألف مبروك يا هندسة! التقييم كان مركز أكتر على الـ Performance ولا الـ Fundamentals؟",
      createdAt: "2026-08-27T19:00:00Z"
    }
  ],
  post_302: [
    {
      id: "comm_2",
      postId: "post_302",
      author: { id: "std_10293", name: "أحمد محمود", university: "جامعة القاهرة" },
      content: "عاش جداً يا مريم! بالتوفيق لفريقكم.",
      createdAt: "2026-08-26T22:00:00Z"
    }
  ]
};

export async function mockGetCommunityFeed(page = 1, limit = 10) {
  await simulateNetworkDelay(400);
  const startIndex = (page - 1) * limit;
  const items = MOCK_POSTS_DATABASE.slice(startIndex, startIndex + limit);
  return {
    items,
    page,
    hasMore: startIndex + limit < MOCK_POSTS_DATABASE.length,
    total: MOCK_POSTS_DATABASE.length
  };
}

export async function mockCreatePost(newPostData) {
  await simulateNetworkDelay(600);
  const createdPost = {
    id: `post_${Date.now()}`,
    author: {
      id: "std_10293",
      name: "أحمد محمود علي",
      university: "جامعة القاهرة",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120"
    },
    content: newPostData.content,
    codeSnippet: newPostData.codeSnippet || null,
    mediaUrl: newPostData.mediaUrl || null,
    likesCount: 0,
    commentsCount: 0,
    isLikedByMe: false,
    createdAt: new Date().toISOString()
  };
  // Prepend in mock
  MOCK_POSTS_DATABASE.unshift(createdPost);
  return createdPost;
}

export async function mockTogglePostLike(postId) {
  await simulateNetworkDelay(200);
  const post = MOCK_POSTS_DATABASE.find((p) => p.id === postId);
  if (post) {
    post.isLikedByMe = !post.isLikedByMe;
    post.likesCount += post.isLikedByMe ? 1 : -1;
  }
  return { success: true, isLikedByMe: post?.isLikedByMe, likesCount: post?.likesCount };
}

export async function mockAddComment(postId, content) {
  await simulateNetworkDelay(300);
  const newComment = {
    id: `comm_${Date.now()}`,
    postId,
    author: {
      id: "std_10293",
      name: "أحمد محمود علي",
      university: "جامعة القاهرة"
    },
    content,
    createdAt: new Date().toISOString()
  };
  if (!MOCK_COMMENTS_DATABASE[postId]) {
    MOCK_COMMENTS_DATABASE[postId] = [];
  }
  MOCK_COMMENTS_DATABASE[postId].push(newComment);
  const post = MOCK_POSTS_DATABASE.find((p) => p.id === postId);
  if (post) post.commentsCount += 1;
  return newComment;
}

export async function mockGetComments(postId) {
  await simulateNetworkDelay(250);
  return MOCK_COMMENTS_DATABASE[postId] || [];
}

export async function mockFollowUser(targetUserId) {
  await simulateNetworkDelay(250);
  return { success: true, targetUserId, isFollowing: true };
}

export async function mockUnfollowUser(targetUserId) {
  await simulateNetworkDelay(250);
  return { success: true, targetUserId, isFollowing: false };
}

export async function mockReportPost(postId, reason) {
  await simulateNetworkDelay(300);
  return { success: true, message: "تم إرسال البلاغ وسيقوم فريق الإشراف بمراجعته." };
}

export async function mockBlockUser(targetUserId) {
  await simulateNetworkDelay(300);
  return { success: true, message: "تم حظر المستخدم بنجاح." };
}
