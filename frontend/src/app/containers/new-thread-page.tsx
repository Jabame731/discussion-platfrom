import { Link, useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import PageShell from "../components/layout/page-shell";
import Tag from "../components/ui/tag";
import Spinner from "../components/ui/spinner";
import {
  useAppDispatch,
  useAppSelector,
  selectThreadSaving,
  selectThreadSaveError,
} from "../data/store";
import { ThreadsUsecase } from "../usecases";
import { toast } from "react-toastify";
import type { Thread } from "../models";

const NewThreadPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const protocolId = searchParams.get("protocolId");

  const saving = useAppSelector(selectThreadSaving);
  const saveError = useAppSelector(selectThreadSaveError);

  const [form, setForm] = useState({
    title: "",
    body: "",
    tags: "",
  });

  const tagArr = form.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usecase = new ThreadsUsecase(dispatch);
    const thread = await usecase.createThread({
      title: form.title,
      body: form.body,
      tags: tagArr,
      protocol_id: protocolId ? Number(protocolId) : undefined,
    });
    if (thread) {
      navigate(`/threads/${(thread as Thread).id}`);
    }
  };

  return (
    <PageShell className="max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-stone-600 mb-6">
        <Link to="/threads" className="hover:text-stone-400 transition-colors">
          Threads
        </Link>
        <span>/</span>
        <span className="text-stone-400">New Thread</span>
      </div>

      <div className="animate-fade-up" style={{ opacity: 0 }}>
        <h1 className="text-3xl text-stone-100 mb-2">Start a Discussion</h1>
        <p className="text-stone-500 text-sm mb-8">
          Ask a question, share an experience, or spark a conversation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {saveError && (
            <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-3">
              {saveError}
            </p>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              placeholder="What's on your mind?"
              className="input text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Body <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.body}
              onChange={set("body")}
              placeholder="Share your thoughts, questions, or experiences..."
              className="textarea min-h-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Tags
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={set("tags")}
              placeholder="sleep, cold-therapy, breathwork"
              className="input"
            />
            {tagArr.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tagArr.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving && <Spinner size="sm" />}
              {saving ? "Posting..." : "Post Thread"}
            </button>
            <Link to="/threads" className="btn-ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </PageShell>
  );
};

export default NewThreadPage;
