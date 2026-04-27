"use client";

import { ImagePlus, Upload } from "lucide-react";
import type { ChangeEvent } from "react";
import type { AvatarPreset, ThemeStyles } from "@/types/prototype";
import { ThemeButton } from "@/components/common/theme-controls";

export function AvatarPicker({
  presets,
  selectedPresetId,
  selectedUploadUrl,
  avatarType,
  onSelectPreset,
  onSelectUpload,
  onChangeType,
  themeStyles,
}: {
  presets: AvatarPreset[];
  selectedPresetId?: string;
  selectedUploadUrl?: string;
  avatarType: "preset" | "upload";
  onSelectPreset: (id: string) => void;
  onSelectUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeType: (next: "preset" | "upload") => void;
  themeStyles: ThemeStyles;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <ThemeButton
          themeStyles={themeStyles}
          active={avatarType === "preset"}
          onClick={() => onChangeType("preset")}
        >
          Preset avatar
        </ThemeButton>
        <ThemeButton
          themeStyles={themeStyles}
          active={avatarType === "upload"}
          onClick={() => onChangeType("upload")}
        >
          Upload image
        </ThemeButton>
      </div>

      {avatarType === "preset" ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {presets.map((preset) => {
            const active = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className="rounded-2xl border p-3 text-left transition"
                style={{
                  borderColor: active ? themeStyles.primary : themeStyles.border,
                  backgroundColor: active ? themeStyles.pill : themeStyles.card,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${preset.gradient} text-xl shadow-lg`}
                  >
                    {preset.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: themeStyles.text }}>
                      {preset.label}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: themeStyles.muted }}>
                      App-ready preset avatar
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-5" style={{ borderColor: themeStyles.border }}>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
            {selectedUploadUrl ? (
              <img
                src={selectedUploadUrl}
                alt="Uploaded avatar preview"
                className="h-20 w-20 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl"
                style={{ backgroundColor: themeStyles.pill, color: themeStyles.primary }}
              >
                <ImagePlus className="h-8 w-8" />
              </div>
            )}

            <div>
              <p className="text-sm font-semibold" style={{ color: themeStyles.text }}>
                Upload profile image
              </p>
              <p className="mt-1 text-xs" style={{ color: themeStyles.muted }}>
                JPG, PNG, or WebP. This is stored locally in the prototype for now.
              </p>
            </div>

            <div>
              <span
                className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium"
                style={{
                  borderColor: themeStyles.border,
                  backgroundColor: themeStyles.card,
                  color: themeStyles.text,
                }}
              >
                <Upload className="h-4 w-4" />
                Choose image
              </span>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onSelectUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
}
