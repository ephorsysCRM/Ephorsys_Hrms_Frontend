import CreateAnnounceModal from "./CreateAnnounceModal";

export default function EditAnnounceModal({
  open,
  announcement,
  onClose,
  onSave,
}) {
  return (
    <CreateAnnounceModal
      open={open}
      initialData={announcement}
      onClose={onClose}
      onSave={onSave}
    />
  );
}