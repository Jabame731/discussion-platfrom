import { useState } from "react";
import Tag from "../ui/tag";
import Spinner from "../ui/spinner";
import { stringToArray } from "../../utils/helpers";
import type { ProtocolForm } from "../../models";
import { Link } from "react-router";
import type { CreateProtocolStatus } from "../../data/models";

interface Props {
  initialValues: ProtocolForm;
  saving?: boolean;
  error?: string | null;
  type: "edit" | "create";
  statusOpt?: {
    [key: string]: string;
  }[];
  onSubmit: (data: {
    title: string;
    content: string;
    tags: string;
    status: string;
  }) => void;
}

export default function ProtocolForm({
  initialValues,
  saving,
  error,
  statusOpt,
  type,
  onSubmit,
}: Props) {
  const [form, setForm] = useState(initialValues);

  const tagArr = stringToArray(form.tags);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      ...form,
      tags: form.tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && saving && (
        <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="space-y-2">
        <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          name="title"
          onChange={handleChange}
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
          name="content"
          onChange={handleChange}
          placeholder={`## Overview\n\nDescribe the protocol...\n\n## Phase 1\n\n...`}
          className="textarea min-h-80 font-mono text-sm"
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
          name="tags"
          onChange={handleChange}
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
          {statusOpt?.map((opt) => (
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
                onChange={handleChange}
                className="sr-only"
              />
              <p className="text-sm font-medium text-stone-300">{opt.label}</p>
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
          {saving && <Spinner size="sm" />}
          {saving
            ? type === "edit"
              ? "Updating..."
              : "Submitting"
            : type === "edit"
              ? "Update Protocol"
              : "Publish Protocol"}
        </button>
        <Link to="/" className="btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
