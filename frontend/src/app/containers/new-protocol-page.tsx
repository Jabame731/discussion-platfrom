import { Link, useNavigate } from "react-router";
import PageShell from "../components/layout/page-shell";
import {
  selectCurrentProtocol,
  selectProtocolSaveError,
  selectProtocolSaving,
  useAppDispatch,
  useAppSelector,
} from "../data/store";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Tag from "../components/ui/tag";

interface ProtocolForm {
  title: string;
  content: string;
  tags: string;
  status: "published" | "draft";
}

const NewProtocolPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const saving = useAppSelector(selectProtocolSaving);
  const saveError = useAppSelector(selectProtocolSaveError);
  const created = useAppSelector(selectCurrentProtocol);

  const [form, setForm] = useState<ProtocolForm>({
    title: "",
    content: "",
    tags: "",
    status: "published",
  });
  const [submitted, setSubmitted] = useState(false);

  const set =
    (k: keyof ProtocolForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const tagArr = form.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Navigate away once the protocol is created in the store

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(form);

    setSubmitted(true);
  };

  const statusOptions: {
    value: "published" | "draft";
    label: string;
    desc: string;
  }[] = [
    { value: "published", label: "Published", desc: "Visible to everyone" },
    { value: "draft", label: "Draft", desc: "Only visible to you" },
  ];
  return (
    <PageShell className="max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-stone-600 mb-6">
        <Link to="/" className="hover:text-stone-400 transition-colors">
          Protocols
        </Link>
        <span>/</span>
        <span className="text-stone-400">New Protocol</span>
      </div>

      <div className="animate-fade-up" style={{ opacity: 0 }}>
        <h1 className="text-3xl text-stone-100 mb-2">Create a Protocol</h1>
        <p className="text-stone-500 text-sm mb-8">
          Share a structured wellness protocol with the community.
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
              placeholder="e.g. 30-Day Cold Exposure Protocol"
              className="input text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Content <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-stone-600">
              Use ## for headings, - for bullet points.
            </p>
            <textarea
              value={form.content}
              onChange={set("content")}
              placeholder={`## Overview\n\nDescribe the protocol...\n\n## Phase 1\n\n...`}
              className="textarea min-h-[320px] font-mono text-sm"
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
              placeholder="sleep, cold-therapy, breathwork, nutrition"
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

          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Visibility
            </label>
            <div className="flex gap-3">
              {statusOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex-1 card p-4 cursor-pointer transition-all ${
                    form.status === opt.value
                      ? "border-sage-600/60 bg-sage-950/30"
                      : "hover:border-[#3a3830]"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={form.status === opt.value}
                    onChange={() =>
                      setForm((f) => ({ ...f, status: opt.value }))
                    }
                    className="sr-only"
                  />
                  <p className="text-sm font-medium text-stone-300">
                    {opt.label}
                  </p>
                  <p className="text-xs text-stone-600 mt-0.5">{opt.desc}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {/* {saving && <Spinner size="sm" />} */}
              {saving ? "Publishing..." : "Publish Protocol"}
            </button>
            <Link to="/" className="btn-ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </PageShell>
  );
};

export default NewProtocolPage;
