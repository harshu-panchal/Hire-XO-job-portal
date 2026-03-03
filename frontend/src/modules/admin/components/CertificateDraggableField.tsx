import { Rnd } from "react-rnd";

export type DraggablePosition = { x: number; y: number };
export type DraggableSize = { width: number; height: number };

type CertificateDraggableFieldProps = {
  value: string;
  position: DraggablePosition;
  size?: DraggableSize;
  onPositionChange: (next: DraggablePosition) => void;
  onSizeChange?: (next: DraggableSize) => void;
  onValueChange: (value: string) => void;
  width: number;
  height: number;
  fontSize?: number;
  textAlign?: "left" | "center" | "right";
  multiline?: boolean;
  resizable?: boolean;
  readOnly?: boolean;
  alwaysVisible?: boolean;
  placeholder?: string;
};

export default function CertificateDraggableField({
  value,
  position,
  size,
  onPositionChange,
  onSizeChange,
  onValueChange,
  width,
  height,
  fontSize = 28,
  textAlign = "left",
  multiline = false,
  resizable = false,
  readOnly = false,
  alwaysVisible = false,
  placeholder,
}: CertificateDraggableFieldProps) {
  const showFrame = alwaysVisible || multiline || resizable;
  const inputClass = showFrame
    ? "drag-handle h-full w-full rounded border border-sky-500/60 bg-white/75 px-2 text-slate-900 shadow-sm focus:border-sky-600 focus:bg-white focus:outline-none"
    : "drag-handle h-full w-full rounded border border-transparent bg-transparent px-2 focus:border-slate-300 focus:bg-white/70 focus:outline-none";

  return (
    <Rnd
      size={size || { width, height }}
      position={position}
      bounds="parent"
      enableResizing={resizable}
      minWidth={140}
      minHeight={40}
      dragHandleClassName="drag-handle"
      resizeHandleStyles={
        resizable
          ? {
              bottomRight: {
                width: 12,
                height: 12,
                borderRadius: 9999,
                background: "#0284c7",
                border: "2px solid #ffffff",
                boxShadow: "0 0 0 1px rgba(2, 132, 199, 0.5)",
              },
            }
          : undefined
      }
      onDragStop={(_, data) => onPositionChange({ x: data.x, y: data.y })}
      onResizeStop={(_, __, ref, ___, pos) => {
        onPositionChange({ x: pos.x, y: pos.y });
        onSizeChange?.({
          width: Math.round(ref.offsetWidth),
          height: Math.round(ref.offsetHeight),
        });
      }}
      className="pointer-events-auto"
    >
      {multiline ? (
        <textarea
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) => onValueChange(e.target.value)}
          className={`${inputClass} resize-none leading-tight`}
          style={{ fontSize, textAlign }}
        />
      ) : (
        <input
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) => onValueChange(e.target.value)}
          className={inputClass}
          style={{ fontSize, textAlign }}
        />
      )}
    </Rnd>
  );
}
