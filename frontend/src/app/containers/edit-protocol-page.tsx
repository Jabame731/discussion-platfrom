import { Link, useNavigate, useParams } from "react-router";
import PageShell from "../components/layout/page-shell";
import {
  selectCurrentProtocol,
  selectCurrentUser,
  selectProtocolBySlug,
  selectProtocolLoading,
  selectProtocolSaveError,
  selectProtocolSaving,
  useAppDispatch,
  useAppSelector,
} from "../data/store";
import { useEffect, useState, type ChangeEvent } from "react";
import Tag from "../components/ui/tag";
import Spinner from "../components/ui/spinner";
import {
  fetchProtocol,
  updateProtocol,
  deleteProtocol,
} from "../data/store/effects/protocol.effects";
import { toast } from "react-toastify";
import { stringToArray } from "../utils/helpers";
import { ProtocolsUsecase } from "../usecases";
import Modal from "../components/ui/modal";

type ProtocolStatus = "published" | "draft" | "archived";

interface ProtocolForm {
  title: string;
  content: string;
  tags: string;
  status: ProtocolStatus;
}

const EditProtocolPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cachedProtocol = useAppSelector(selectProtocolBySlug(slug ?? ""));
  const currentProtocol = useAppSelector(selectCurrentProtocol);
  const pageLoading = useAppSelector(selectProtocolLoading);
  const saving = useAppSelector(selectProtocolSaving);
  const saveError = useAppSelector(selectProtocolSaveError);
  const user = useAppSelector(selectCurrentUser);

  const protocol =
    cachedProtocol?.slug === slug
      ? cachedProtocol
      : currentProtocol?.slug === slug
        ? currentProtocol
        : null;

  const [form, setForm] = useState<ProtocolForm>({
    title: "",
    content: "",
    tags: "",
    status: protocol?.status as ProtocolStatus,
  });

  const [openModal, setOpenModal] = useState(false);

  const handleOpenDeleteModal = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleDeleteProtocol = async () => {
    try {
      await dispatch(deleteProtocol(protocol?.slug!)).unwrap();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (slug && !protocol) {
      new ProtocolsUsecase(dispatch).loadProtocol(slug);
    }
  }, [slug, dispatch]);

  useEffect(() => {
    if (protocol) {
      setForm({
        title: protocol.title,
        content: protocol.content,
        tags: protocol.tags?.join(", ") ?? "",
        status: protocol.status as ProtocolStatus,
      });
    }
  }, [protocol]);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const tagArr = stringToArray(form.tags);
  const isOwner = user?.username === protocol?.author?.username;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(
        updateProtocol({
          id: protocol!.slug,
          payload: {
            title: form.title,
            content: form.content,
            tags: tagArr,
            status: form.status,
          },
        }),
      ).unwrap();
      navigate(`/protocols/${protocol!.slug}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (pageLoading || !protocol) {
    return (
      <PageShell>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </PageShell>
    );
  }

  if (!isOwner) {
    return (
      <PageShell>
        <div className="card p-8 text-center">
          <p className="text-stone-400">
            You don't have permission to edit this protocol.
          </p>
          <Link
            to={`/protocols/${protocol.slug}`}
            className="btn-ghost mt-4 inline-block"
          >
            ← Back
          </Link>
        </div>
      </PageShell>
    );
  }

  const statusOptions: {
    value: ProtocolStatus;
    label: string;
    desc: string;
  }[] = [
    { value: "published", label: "Published", desc: "Visible to everyone" },
    { value: "draft", label: "Draft", desc: "Only visible to you" },
    { value: "archived", label: "Archived", desc: "Hidden from listings" },
  ];

  return (
    <>
      <PageShell className="max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-stone-600 mb-6">
          <Link to="/" className="hover:text-stone-400 transition-colors">
            Protocols
          </Link>
          <span>/</span>
          <Link
            to={`/protocols/${protocol.slug}`}
            className="hover:text-stone-400 transition-colors truncate max-w-48"
          >
            {protocol.title}
          </Link>
          <span>/</span>
          <span className="text-stone-400">Edit</span>
        </div>

        <div className="animate-fade-up" style={{ opacity: 0 }}>
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl text-stone-100 mb-2">Edit Protocol</h1>
              <p className="text-stone-500 text-sm">
                Update your wellness protocol.
              </p>
            </div>
            <button
              onClick={handleOpenDeleteModal}
              disabled={saving}
              className="text-sm text-red-500 hover:text-red-400 border border-red-900/40 hover:border-red-700/60 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
            >
              Delete Protocol
            </button>
          </div>

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
                name="title"
                onChange={handleFieldChange}
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
                onChange={handleFieldChange}
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
                onChange={handleFieldChange}
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

            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Status
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
                      onChange={handleFieldChange}
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
                {saving && <Spinner size="sm" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link to={`/protocols/${protocol.slug}`} className="btn-ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </PageShell>

      <Modal isOpen={openModal} onClose={closeModal} title="Delete Protocol">
        <div>
          <p className="text-stone-400 mb-4">
            Are you sure you want to delete this protocol?
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={closeModal} className="btn-ghost">
              Cancel
            </button>
            <button
              onClick={handleDeleteProtocol}
              className="btn-primary bg-red-700 hover:bg-red-600"
            >
              {saving ? "Deleting..." : "Delete Protocol"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditProtocolPage;
