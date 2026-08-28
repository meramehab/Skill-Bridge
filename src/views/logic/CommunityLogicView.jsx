/**
 * @file CommunityLogicView.jsx
 * @description Logic wiring for Community page, optimistic posts feed, instant likes, comments, and moderation.
 */
import React, { useState } from "react";
import { useCommunityFeed } from "../../hooks/useCommunityFeed";
import { useCreatePost } from "../../hooks/useCreatePost";
import { usePostInteractions } from "../../hooks/usePostInteractions";

export function CommunityLogicView({
  Card = (p) => <div {...p} />,
  Button = (p) => <button {...p} />,
  Modal = (p) => <div {...p} />,
  Skeleton = () => <div>Loading...</div>
}) {
  const feed = useCommunityFeed();

  // Create Post Hook with optimistic add / rollback
  const createPostHook = useCreatePost({
    onOptimisticAdd: (optimisticPost) => {
      feed.prependPost(optimisticPost);
    },
    onRollback: (tempId) => {
      feed.removeLocalPost(tempId);
    },
    onConfirmed: (tempId, confirmedPost) => {
      feed.updateLocalPost(tempId, () => confirmedPost);
    }
  });

  // Post Interactions Hook
  const interactions = usePostInteractions(feed.updateLocalPost);

  // Active Comment Inputs State per Post
  const [commentInputs, setCommentInputs] = useState({});
  const [reportModalPostId, setReportModalPostId] = useState(null);

  const handleCommentSubmit = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    await interactions.handleAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div id="community-container">
      {/* Create New Post Widget */}
      <Card id="create-post-card">
        <h3>شارك خبرتك أو اسأل مجتمع الطلاب</h3>

        {createPostHook.error && (
          <div id="create-post-error" role="alert">
            {createPostHook.error}
          </div>
        )}

        <textarea
          id="post-content-textarea"
          rows={3}
          placeholder="ما الذي تعمل عليه اليوم؟ شارك نصيحة أو تحدياً برمجياً..."
          value={createPostHook.content}
          onChange={(e) => createPostHook.setContent(e.target.value)}
        />

        <textarea
          id="post-code-textarea"
          rows={2}
          placeholder="أضف كود تجريبي (اختياري)..."
          value={createPostHook.codeSnippet}
          onChange={(e) => createPostHook.setCodeSnippet(e.target.value)}
        />

        <Button
          id="btn-publish-post"
          onClick={createPostHook.handleSubmit}
          disabled={createPostHook.isSubmitting}
        >
          {createPostHook.isSubmitting ? "جارٍ النشر..." : "نشر في المجتمع"}
        </Button>
      </Card>

      {/* Feed States */}
      {feed.isLoading && <Skeleton id="feed-skeleton" />}

      {feed.isError && (
        <div id="feed-error-box">
          <p>{feed.error}</p>
          <Button onClick={feed.refetch}>إعادة المحاولة</Button>
        </div>
      )}

      {feed.isEmpty && (
        <Card id="feed-empty-box">
          <h3>لا توجد منشورات في خلاصتك حالياً</h3>
          <p>تابع زملاءك من الجامعات المختلفة لمشاهدة منشوراتهم وتجاربهم.</p>
          <Button onClick={feed.refetch}>استكشاف الطلاب المقترحين</Button>
        </Card>
      )}

      {/* Feed Posts */}
      {feed.isSuccess && (
        <div id="posts-list">
          {feed.posts.map((post) => (
            <Card key={post.id} id={`post-card-${post.id}`}>
              {/* Author Header */}
              <div id="post-author-header">
                <img src={post.author.avatar || "/avatar-placeholder.png"} alt={post.author.name} />
                <div>
                  <strong>{post.author.name}</strong>
                  <span>{post.author.university}</span>
                </div>

                {/* Moderation Menu Trigger */}
                <Button onClick={() => setReportModalPostId(post.id)}>
                  إبلاغ
                </Button>
              </div>

              {/* Content */}
              <p id="post-body">{post.content}</p>

              {post.codeSnippet && (
                <pre id="post-code-block">
                  <code>{post.codeSnippet}</code>
                </pre>
              )}

              {post.mediaUrl && (
                <img src={post.mediaUrl} alt="Post media" id="post-media-image" />
              )}

              {/* Action Buttons (Like / Comments) */}
              <div id="post-actions-bar">
                <Button
                  id={`btn-like-${post.id}`}
                  onClick={() => interactions.handleToggleLike(post)}
                >
                  {post.isLikedByMe ? "❤️ أعجبني" : "🤍 إعجاب"} ({post.likesCount})
                </Button>

                <span>💬 {post.commentsCount} تعليق</span>
              </div>

              {/* Comments Section */}
              <div id={`comments-section-${post.id}`}>
                <input
                  id={`comment-input-${post.id}`}
                  placeholder="اكتب تعليقاً..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCommentSubmit(post.id);
                  }}
                />
                <Button onClick={() => handleCommentSubmit(post.id)}>إرسال</Button>
              </div>
            </Card>
          ))}

          {feed.hasMore && (
            <Button
              id="btn-load-more-feed"
              onClick={feed.loadMore}
              disabled={feed.isLoadingMore}
            >
              {feed.isLoadingMore ? "جارٍ التحميل..." : "تحميل المزيد من المنشورات"}
            </Button>
          )}
        </div>
      )}

      {/* Report Modal */}
      {reportModalPostId && (
        <Modal
          id="report-post-modal"
          isOpen={Boolean(reportModalPostId)}
          onClose={() => setReportModalPostId(null)}
        >
          <h3>الإبلاغ عن المنشور</h3>
          <p>يرجى تحديد سبب الإبلاغ لمساعدة فريق الإشراف.</p>
          <Button
            onClick={async () => {
              await interactions.handleReportPost(reportModalPostId, "محتوى غير لائق");
              setReportModalPostId(null);
            }}
          >
            تأكيد الإبلاغ
          </Button>
        </Modal>
      )}
    </div>
  );
}

export default CommunityLogicView;
