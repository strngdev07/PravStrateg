export type FormDraft = {
  fields: Record<string, string>;
  files: File[];
  purposeFromUrl: string | null;
  renderedAt: number | null;
};

const drafts = new Map<string, FormDraft>();

export function readFormDraft(key: string): FormDraft | null {
  if (typeof window === "undefined") return null;
  return drafts.get(key) ?? null;
}

export function saveFormDraft(key: string, draft: FormDraft): void {
  if (typeof window === "undefined") return;
  drafts.set(key, draft);
}

export function clearFormDraft(key: string): void {
  drafts.delete(key);
}
