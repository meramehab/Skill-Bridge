/**
 * @file CommunityLogicView.jsx
 * @description Modern Figma presentation layer for the Community Feed page connecting useCommunityFeed, useCreatePost, and usePostInteractions.
 * Features post creator with code snippet support, interactive likes, comments, and moderation report modal.
 */
import React, { useState } from "react";
import { useCommunityFeed } from "../../hooks/useCommunityFeed";
import { useCreatePost } from "../../hooks/useCreatePost";
import { usePostInteractions } from "../../hooks/usePostInteractions";
import { ButtonLogic as Button } from "../../components/contracts/ButtonLogic";
import { CardLogic as Card } from "../../components/contracts/CardLogic";
import { ModalLogic as Modal } from "../../components/contracts/ModalLogic";
import { NavbarLogic as Navbar } from "../../components/contracts/NavbarLogic";
import { FooterLogic as Footer } from "../../components/contracts/FooterLogic";
import {
  MessageSquare,
  Heart,
  Share2,
  Code2,
  Send,
  Flag,
  Sparkles,
  Users,
  AlertTriangle,
  GraduationCap
} from "lucide-react";

export function CommunityLogicView({
  CardComponent = Card,
  ButtonComponent = Button,
  ModalComponent = Modal
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
    <div id="community-container" className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-3xl space-y-8">
          {/* Header */}
          <div className="text-center sm:text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>مجتمع الطلاب والخرّيجين</span>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-white mb-2">
              مجتمع SkillBridge الأكاديمي
            </h1>
            <p className="text-gray-400 text-sm">
              شارك تجاربك البرمجية، اطرح أسئلتك، وتفاعل مع زملائك من مختلف الجامعات المصرية.
            </p>
          </div>

          {/* ─── Create New Post Card ─── */}
          <CardComponent id="create-post-card" variant="elevated" className="p-6 border border-[#222634]">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              شارك خبرتك أو اسأل مجتمع الطلاب
            </h3>

            {createPostHook.error && (
              <div id="create-post-error" role="alert" className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {createPostHook.error}
              </div>
            )}

            <div className="space-y-3">
              <textarea
                id="post-content-textarea"
                rows={3}
                placeholder="ما الذي تعمل عليه اليوم؟ شارك نصيحة، إنجازاً أو تحدياً تقنياً..."
                value={createPostHook.content}
                onChange={(e) => createPostHook.setContent(e.target.value)}
                className="w-full bg-[#181b24] border border-[#2a2f3e] focus:border-emerald-500 text-sm rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none transition resize-none"
              />

              <div className="relative">
                <textarea
                  id="post-code-textarea"
                  rows={2}
                  placeholder="أضف كوداً تجريبياً (اختياري)..."
                  value={createPostHook.codeSnippet}
                  onChange={(e) => createPostHook.setCodeSnippet(e.target.value)}
                  className="w-full bg-[#13161e] border border-[#262c3d] focus:border-emerald-500 font-mono text-xs rounded-xl p-3 pl-10 text-emerald-300 placeholder-gray-600 focus:outline-none transition resize-none"
                />
                <Code2 className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
              </div>

              <div className="flex justify-end pt-1">
                <ButtonComponent
                  id="btn-publish-post"
                  variant="primary"
                  size="md"
                  onClick={createPostHook.handleSubmit}
                  isLoading={createPostHook.isSubmitting}
                  disabled={createPostHook.isSubmitting || !createPostHook.content?.trim()}
                >
                  <Send className="w-4 h-4 ml-1" />
                  <span>{createPostHook.isSubmitting ? "جارٍ النشر..." : "نشر في المجتمع"}</span>
                </ButtonComponent>
              </div>
            </div>
          </CardComponent>

          {/* ─── Feed States ─── */}
          {feed.isLoading && (
            <div id="feed-skeleton" className="space-y-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-[#13161e] border border-[#222634] rounded-2xl p-6 animate-pulse space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-white/15 rounded w-1/4" />
                      <div className="h-3 bg-white/10 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-16 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          )}

          {feed.isError && (
            <div id="feed-error-box" className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
              <p className="text-sm text-red-400 font-medium mb-4">{feed.error}</p>
              <ButtonComponent variant="outline" size="sm" onClick={feed.refetch}>
                إعادة المحاولة
              </ButtonComponent>
            </div>
          )}

          {feed.isEmpty && (
            <CardComponent id="feed-empty-box" variant="surface" className="p-12 text-center max-w-md mx-auto">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">لا توجد منشورات في خلاصتك حالياً</h3>
              <p className="text-xs text-gray-400 mb-6">كن أول من يشارك منشوراً أو تابع زملاءك لمشاهدة تجاربهم.</p>
              <ButtonComponent variant="primary" size="sm" onClick={feed.refetch}>
                تحديث الخلاصة
              </ButtonComponent>
            </CardComponent>
          )}

          {/* ─── Posts List ─── */}
          {feed.isSuccess && (
            <div id="posts-list" className="space-y-6">
              {feed.posts.map((post) => (
                <CardComponent key={post.id} id={`post-card-${post.id}`} variant="surface" className="p-6 border border-[#222634] space-y-4">
                  {/* Author Header */}
                  <div id="post-author-header" className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                        alt={post.author?.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                      />
                      <div>
                        <strong className="text-sm font-bold text-white block">{post.author?.name}</strong>
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          {post.author?.university}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setReportModalPostId(post.id)}
                      className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition"
                      title="إبلاغ عن محتوى"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <p id="post-body" className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Code Snippet if present */}
                  {post.codeSnippet && (
                    <pre id="post-code-block" className="p-4 rounded-xl bg-[#0f1117] border border-[#262c3d] overflow-x-auto text-xs font-mono text-emerald-300">
                      <code>{post.codeSnippet}</code>
                    </pre>
                  )}

                  {/* Media Image if present */}
                  {post.mediaUrl && (
                    <img src={post.mediaUrl} alt="Post media" id="post-media-image" className="w-full rounded-xl max-h-96 object-cover border border-[#262c3d]" />
                  )}

                  {/* Actions Bar (Like / Comment Count) */}
                  <div id="post-actions-bar" className="flex items-center gap-4 pt-3 border-t border-[#1e2330]">
                    <button
                      id={`btn-like-${post.id}`}
                      onClick={() => interactions.handleToggleLike(post)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition ${
                        post.isLikedByMe
                          ? "bg-red-500/15 text-red-400 border border-red-500/30"
                          : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLikedByMe ? "fill-red-400" : ""}`} />
                      <span>{post.likesCount || 0}</span>
                    </button>

                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentsCount || 0} تعليق</span>
                    </span>
                  </div>

                  {/* Comments Box */}
                  <div id={`comments-section-${post.id}`} className="pt-3 border-t border-[#1e2330]/60 space-y-3">
                    <div className="flex gap-2">
                      <input
                        id={`comment-input-${post.id}`}
                        type="text"
                        placeholder="اكتب تعليقاً على هذا المنشور..."
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCommentSubmit(post.id);
                        }}
                        className="flex-1 bg-[#13161e] border border-[#262c3d] focus:border-emerald-500 text-xs rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none"
                      />
                      <ButtonComponent
                        size="sm"
                        variant="primary"
                        onClick={() => handleCommentSubmit(post.id)}
                      >
                        إرسال
                      </ButtonComponent>
                    </div>
                  </div>
                </CardComponent>
              ))}

              {/* Load More Trigger */}
              {feed.hasMore && (
                <div className="text-center pt-4">
                  <ButtonComponent
                    id="btn-load-more-feed"
                    variant="secondary"
                    size="md"
                    onClick={feed.loadMore}
                    isLoading={feed.isLoadingMore}
                    disabled={feed.isLoadingMore}
                  >
                    {feed.isLoadingMore ? "جارٍ التحميل..." : "تحميل المزيد من المنشورات"}
                  </ButtonComponent>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ─── Moderation Report Modal ─── */}
      {reportModalPostId && (
        <ModalComponent
          id="report-post-modal"
          isOpen={Boolean(reportModalPostId)}
          onClose={() => setReportModalPostId(null)}
          title="الإبلاغ عن المنشور"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-sm">
            <p className="text-gray-300 text-xs leading-relaxed">
              يرجى تأكيد الإبلاغ عن هذا المنشور لمساعدة فريق الإشراف في الحفاظ على بيئة تعليمية آمنة.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#222634]">
              <ButtonComponent variant="secondary" size="sm" onClick={() => setReportModalPostId(null)}>
                إلغاء
              </ButtonComponent>
              <ButtonComponent
                variant="danger"
                size="sm"
                onClick={async () => {
                  await interactions.handleReportPost(reportModalPostId, "محتوى غير لائق");
                  setReportModalPostId(null);
                }}
              >
                تأكيد الإبلاغ
              </ButtonComponent>
            </div>
          </div>
        </ModalComponent>
      )}

      <Footer />
    </div>
  );
}

export default CommunityLogicView;
