import { toast } from "vue-sonner";

export function toastUndo(
  message: string,
  commit: () => Promise<unknown>,
  done: () => void,
) {
  let settled = false;
  const settle = async (undo: boolean) => {
    if (settled) return;
    settled = true;
    try {
      if (!undo) await commit();
    } catch {
      toast.error("Não foi possível excluir. O item foi restaurado.");
    }
    done();
  };

  toast(message, {
    duration: 5000,
    action: { label: "Desfazer", onClick: () => settle(true) },
    onAutoClose: () => settle(false),
    onDismiss: () => settle(false),
  });
}
