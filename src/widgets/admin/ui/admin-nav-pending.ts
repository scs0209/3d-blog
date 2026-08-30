type AdminNavListener = (pending: boolean) => void;

let pendingCount = 0;
const listeners = new Set<AdminNavListener>();

const emit = () => {
  const pending = pendingCount > 0;
  for (const listener of listeners) {
    listener(pending);
  }
};

export const beginAdminNavPending = () => {
  pendingCount += 1;
  emit();
};

export const endAdminNavPending = () => {
  pendingCount = Math.max(0, pendingCount - 1);
  emit();
};

export const subscribeAdminNavPending = (listener: AdminNavListener) => {
  listeners.add(listener);
  listener(pendingCount > 0);
  return () => {
    listeners.delete(listener);
  };
};
