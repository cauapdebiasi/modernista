"use client";

import { toast } from "sonner";
import { playSound } from "./sounds";

export type ToastKind = "ok" | "warn" | "err" | "info";

/** Ponte pro sonner que toca o som certo junto com o toast. Monte o
 *  <Toaster> uma vez na raiz (ver README: position="top-center",
 *  theme="light", duration={3000}, richColors, expand). */
export function pushToast(title: string, body?: string, kind: ToastKind = "info") {
  const opts = body ? { description: body } : undefined;
  if (kind === "ok") playSound("success");
  else if (kind === "err") playSound("error");
  else if (kind === "warn") playSound("warning");
  switch (kind) {
    case "ok":
      return toast.success(title, opts);
    case "err":
      return toast.error(title, opts);
    case "warn":
      return toast.warning(title, opts);
    default:
      return toast.info(title, opts);
  }
}
