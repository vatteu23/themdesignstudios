"use client";

import { useEffect, useState } from "react";
import SafeImage, { isValidImageSrc } from "@/components/admin/SafeImage";
import { HiOutlinePlus } from "@/components/admin/adminIcons";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { FormField, FormSection, SaveButton, TextAreaField } from "@/components/admin/FormField";
import ImagePicker from "@/components/admin/ImagePicker";
import {
  listAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/lib/cms/team";
import { TeamMember } from "@/types/cms";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const data = await listAllTeamMembers();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.name) return;
    setSaving(true);
    try {
      if (editing.id) {
        await updateTeamMember(editing.id, editing);
      } else {
        await createTeamMember({
          name: editing.name,
          role: editing.role ?? "",
          bio: editing.bio ?? "",
          image_url: editing.image_url ?? "",
          order: editing.order ?? members.length,
          active: editing.active ?? true,
        });
      }
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteTeamMember(deleteId);
    setDeleteId(null);
    await load();
  };

  return (
    <>
      <AdminTopBar title="Team" />
      <div className="p-8">
        <div className="mb-6 flex justify-between">
          <p className="text-sm text-stone-500">{members.length} members</p>
          <button
            onClick={() =>
              setEditing({ name: "", role: "", bio: "", order: members.length, active: true })
            }
            className="inline-flex items-center gap-2 rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add member
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSave} className="mb-8 max-w-2xl">
            <FormSection title={editing.id ? "Edit member" : "New member"}>
              <FormField
                label="Name"
                value={editing.name ?? ""}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                required
              />
              <FormField
                label="Role"
                value={editing.role ?? ""}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
              />
              <TextAreaField
                label="Bio"
                value={editing.bio ?? ""}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                rows={4}
              />
              <ImagePicker
                label="Photo"
                value={editing.image_url}
                onChange={(v) => setEditing({ ...editing, image_url: v })}
              />
              <FormField
                label="Display order"
                type="number"
                value={editing.order ?? 0}
                onChange={(e) =>
                  setEditing({ ...editing, order: parseInt(e.target.value) || 0 })
                }
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.active !== false}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                />
                Active
              </label>
              <div className="flex gap-3">
                <SaveButton loading={saving} />
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg border border-stone-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </FormSection>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-stone-200 bg-white p-4"
              >
                {isValidImageSrc(m.image_url) && (
                  <div className="relative mb-3 h-32 overflow-hidden rounded-lg">
                    <SafeImage src={m.image_url} alt={m.name} fill />
                  </div>
                )}
                <h3 className="font-medium text-stone-800">{m.name}</h3>
                <p className="text-sm text-stone-500">{m.role}</p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => setEditing(m)}
                    className="text-sm text-stone-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(m.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete team member"
        message="Remove this team member from the about page?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
