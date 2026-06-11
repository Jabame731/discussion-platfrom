import { Link, useNavigate, useParams } from "react-router";
import PageShell from "../components/layout/page-shell";
import TwoColumnLayout from "../components/layout/two-column-layout";
import NewThreadForm from "../components/threads/new-thread-form";
import ThreadList from "../components/threads/thread-list";
import EmptyState from "../components/ui/empty-state";
import ReviewItem from "../components/ui/review-item";
import ReviewForm from "../components/protocols/review-form";
import ProtocolStats from "../components/protocols/protocol-stats";
import { FaRegEdit } from "react-icons/fa";
import {
  deleteReviewLoading,
  editReviewError,
  editReviewLoading,
  getProtocolReviews,
  getProtocolThreads,
  isReviewAddLoading,
  isReviewFailed,
  isReviewSucceeded,
  selectCurrentProtocol,
  selectCurrentUser,
  selectProtocolBySlug,
  selectProtocolError,
  selectProtocolLoading,
  selectProtocolReviews,
  selectProtocolReviewsLoading,
  selectProtocolThreads,
  selectProtocolThreadsLoading,
  selectThreadSaveError,
  selectThreadSaving,
  threadActions,
  useAppDispatch,
  useAppSelector,
} from "../data/store";

import { useEffect, useState } from "react";
import Spinner from "../components/ui/spinner";
import Tag from "../components/ui/tag";
import Avatar from "../components/ui/avatar";
import Stars from "../components/ui/stars";
import clsx from "clsx";
import { toast } from "react-toastify";
import type { Review } from "../models";
import Modal from "../components/ui/modal";
import { ProtocolsUsecase, ThreadsUsecase } from "../usecases";
import { stringToArray } from "../utils/helpers";

type TabId = "threads" | "reviews";

const MarkdownContent = ({ content = "" }: { content: string }) => {
  const lines = content.split("\n");
  const result: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## "))
      result.push(
        <h2 key={i} className="font-serif text-xl text-stone-100 mt-6 mb-3">
          {line.slice(3)}
        </h2>,
      );
    else if (line.startsWith("# "))
      result.push(
        <h1 key={i} className="font-serif text-2xl text-stone-100 mt-6 mb-3">
          {line.slice(2)}
        </h1>,
      );
    else if (line.startsWith("- ")) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(<li key={i}>{lines[i].slice(2)}</li>);
        i++;
      }
      result.push(
        <ul
          key={`ul-${i}`}
          className="list-disc list-inside space-y-1 text-stone-400 text-sm mb-3 ml-2"
        >
          {items}
        </ul>,
      );
      continue;
    } else if (line.trim()) {
      result.push(
        <p key={i} className="text-stone-400 text-sm leading-relaxed mb-3">
          {line}
        </p>,
      );
    }
    i++;
  }
  return <div className="space-y-1">{result}</div>;
};

const ProtocolDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();

  const protocol = useAppSelector(selectCurrentProtocol);
  const loading = useAppSelector(selectProtocolLoading);
  const error = useAppSelector(selectProtocolError);
  const reviews = useAppSelector(getProtocolReviews);
  const reviewsLoading = useAppSelector(selectProtocolReviewsLoading);
  const threads = useAppSelector(getProtocolThreads);
  const threadsLoading = useAppSelector(selectProtocolThreadsLoading);

  const reviewLoading = useAppSelector(isReviewAddLoading);
  const reviewFailure = useAppSelector(isReviewFailed);
  const reviewSucceeded = useAppSelector(isReviewSucceeded);
  const reviewEditLoading = useAppSelector(editReviewLoading);
  const reviewEditError = useAppSelector(editReviewError);
  const threadAddLoading = useAppSelector(selectThreadSaving);
  const threadAddError = useAppSelector(selectThreadSaveError);
  const reviewDeleteLoading = useAppSelector(deleteReviewLoading);

  const user = useAppSelector(selectCurrentUser);

  const [activeTab, setActiveTab] = useState<TabId>("threads");
  const [showThread, setShowThread] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Partial<Review> | null>(
    null,
  );
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const userHasReview = reviews?.some(
    (r) => r.author?.username === user?.username,
  );
  const isOwner = user?.username === protocol?.author?.username;

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setModalType("edit");
  };

  const handleDelete = (review: Partial<Review>) => {
    setSelectedReview(review);
    setModalType("delete");
  };

  const handleEditReview = (data: {
    rating: number;
    feedback: string;
    slug: string;
  }) => {
    setIsSubmittingReview(true);
    new ProtocolsUsecase(dispatch).updateReview(selectedReview?.id as number, {
      feedback: data.feedback,
      rating: data.rating,
    });
  };

  const handleDeleteReview = () => {
    setIsSubmittingDelete(true);
    new ProtocolsUsecase(dispatch).deleteReview(selectedReview?.id as number);
  };

  const closeModal = () => {
    setSelectedReview(null);
    setModalType(null);
  };

  const handleCancelThread = () => {
    setShowThread(false);
    dispatch(threadActions.resetThreadError());
  };

  const handleOpenThread = () => {
    setShowThread(true);
    dispatch(threadActions.resetThreadError());
  };

  const handleReviewSubmit = (data: {
    rating: number;
    feedback: string;
    slug: string;
  }) => {
    new ProtocolsUsecase(dispatch).createReview(data.slug, {
      feedback: data.feedback,
      rating: data.rating,
    });
  };

  const handleThreadSubmit = async (data: {
    title: string;
    tags: string;
    body: string;
  }) => {
    const tagsArr = stringToArray(data.tags);
    const usecase = new ThreadsUsecase(dispatch);
    await usecase.createThread({
      body: data.body,
      title: data.title,
      tags: tagsArr,
      protocol_id: protocol?.id,
    });
    if (!threadAddError) {
      setShowThread(false);
      dispatch(threadActions.resetThreadError());
    }
  };

  useEffect(() => {
    if (!slug) return;
    const usecase = new ProtocolsUsecase(dispatch);
    usecase.loadProtocol(slug);
  }, [slug, dispatch]);

  useEffect(() => {
    if (isSubmittingReview && !reviewEditLoading) {
      toast.success("Review updated", { position: "bottom-right" });
      closeModal();
      setIsSubmittingReview(false);
    }
  }, [isSubmittingReview, reviewEditLoading]);

  useEffect(() => {
    if (isSubmittingDelete && !reviewDeleteLoading) {
      toast.success("Review deleted", { position: "bottom-right" });
      closeModal();
      setIsSubmittingDelete(false);
    }
  }, [isSubmittingDelete, reviewDeleteLoading]);

  if (loading)
    return (
      <PageShell>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </PageShell>
    );

  if (error || !protocol)
    return (
      <PageShell>
        <div className="card p-8 text-center">
          <p className="text-red-400">{error ?? "Protocol not found."}</p>
          <Link to="/" className="btn-ghost mt-4 inline-block">
            ← Back
          </Link>
        </div>
      </PageShell>
    );

  const tags: string[] = protocol.tags ?? [];
  const tabs: { id: TabId; label: string }[] = [
    { id: "threads", label: `Threads (${threads?.length})` },
    { id: "reviews", label: `Reviews (${reviews?.length})` },
  ];

  return (
    <>
      <PageShell>
        <div className="flex items-center justify-between gap-2 mb-6 animate-fade-in flex-wrap">
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Link to="/" className="hover:text-stone-400 transition-colors">
              Protocols
            </Link>
            <span>/</span>
            <span className="text-stone-400 truncate max-w-64">
              {protocol.title}
            </span>
          </div>
          {isOwner && (
            <Link
              to={`/protocols/${protocol.slug}/edit`}
              className="text-sm text-stone-400 hover:text-stone-200 border border-[#2a2820] hover:border-[#3a3830] px-3 py-1.5 rounded-lg transition-all"
            >
              <span className="flex items-center gap-2">
                <FaRegEdit />
                Edit Protocol
              </span>
            </Link>
          )}
        </div>

        <TwoColumnLayout
          main={
            <div className="space-y-6">
              <div className="animate-fade-up" style={{ opacity: 0 }}>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                )}
                <h1 className="font-serif text-3xl sm:text-4xl text-stone-100 leading-tight mb-4">
                  {protocol.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-stone-500 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Avatar name={protocol.author?.name ?? "?"} size="sm" />
                    <span>{protocol.author?.name}</span>
                  </div>
                  <Stars rating={protocol.average_rating ?? 0} size="sm" />
                  <span>
                    {(protocol.average_rating ?? 0).toFixed(1)} (
                    {protocol.reviews_count} reviews)
                  </span>
                </div>
              </div>

              <div
                className="card p-6 animate-fade-up stagger-1"
                style={{ opacity: 0 }}
              >
                <MarkdownContent content={protocol.content} />
              </div>

              <div className="animate-fade-up stagger-2" style={{ opacity: 0 }}>
                <div className="flex items-center gap-1 border-b border-[#2a2820] mb-5">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={clsx(
                        "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                        activeTab === tab.id
                          ? "border-sage-500 text-sage-300"
                          : "border-transparent text-stone-500 hover:text-stone-300",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === "threads" && (
                  <div className="space-y-4">
                    {!showThread ? (
                      user ? (
                        <button
                          onClick={handleOpenThread}
                          className="btn-primary w-full sm:w-auto"
                        >
                          + Start Discussion
                        </button>
                      ) : (
                        <p className="text-sm text-stone-500">
                          <Link
                            to="/login"
                            className="text-sage-400 hover:text-sage-300"
                          >
                            Sign in
                          </Link>{" "}
                          to start a discussion.
                        </p>
                      )
                    ) : (
                      <NewThreadForm
                        isSubmitting={threadAddLoading}
                        error={threadAddError}
                        onSubmit={handleThreadSubmit}
                        onCancel={handleCancelThread}
                      />
                    )}
                    {(threads ?? []).length > 0 ? (
                      <ThreadList threads={threads!} loading={threadsLoading} />
                    ) : (
                      <EmptyState
                        icon="💬"
                        title="No threads yet"
                        description="Start the first discussion."
                      />
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-1">
                    {(reviews ?? []).map((r) => (
                      <ReviewItem
                        key={r.id}
                        review={r}
                        user={user}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                    {(reviews ?? []).length === 0 && (
                      <EmptyState
                        icon="⭐"
                        title="No reviews yet"
                        description="Share your experience."
                      />
                    )}
                    {user ? (
                      !userHasReview ? (
                        <ReviewForm
                          mode="create"
                          slug={protocol.slug}
                          onSubmit={handleReviewSubmit}
                          loading={reviewLoading}
                          error={reviewFailure}
                          success={reviewSucceeded}
                        />
                      ) : null
                    ) : (
                      <div className="mt-3 text-sm text-stone-500">
                        <Link
                          className="text-sage-400 hover:text-sage-300"
                          to="/login"
                        >
                          Sign in
                        </Link>{" "}
                        to write a review.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          }
          sidebar={
            <div
              className="space-y-4 animate-fade-up stagger-3"
              style={{ opacity: 0 }}
            >
              <ProtocolStats protocol={{ ...protocol, threads }} />
              {protocol.author && (
                <div className="card p-4">
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">
                    Author
                  </h4>
                  <div className="flex items-center gap-3">
                    <Avatar name={protocol.author.name} size="md" />
                    <div>
                      <p className="text-sm font-medium text-stone-300">
                        {protocol.author.name}
                      </p>
                      {protocol.author.bio && (
                        <p className="text-xs text-stone-600 mt-0.5 line-clamp-2">
                          {protocol.author.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
        />
      </PageShell>

      <Modal
        isOpen={modalType !== null}
        title={modalType === "edit" ? "Edit Review" : "Delete Review"}
        onClose={closeModal}
      >
        {modalType === "edit" && selectedReview && (
          <ReviewForm
            mode="edit"
            review={selectedReview}
            slug={protocol.slug}
            onSubmit={handleEditReview}
            loading={reviewEditLoading}
            error={reviewEditError}
          />
        )}
        {modalType === "delete" && selectedReview && (
          <div>
            <p className="text-stone-400 mb-4">
              Are you sure you want to delete this review?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="btn-ghost">
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="btn-primary bg-red-700 hover:bg-red-600"
              >
                {reviewDeleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ProtocolDetailPage;
