import { Rnd } from "react-rnd";

export type DraggablePosition = { x: number; y: number };

type CertificateDraggableFieldProps = {
  value: string;
  position: DraggablePosition;
  onPositionChange: (next: DraggablePosition) => void;
  onValueChange: (value: string) => void;
  width: number;
  height: number;
  fontSize?: number;
  textAlign?: "left" | "center" | "right";
  multiline?: boolean;
  readOnly?: boolean;
};

export default function CertificateDraggableField({
  value,
  position,
  onPositionChange,
  onValueChange,
  width,
  height,
  fontSize = 28,
  textAlign = "left",
  multiline = false,
  readOnly = false,
}: CertificateDraggableFieldProps) {
  return (
    <Rnd
      size={{ width, height }}
      position={position}
      bounds="parent"
      enableResizing={false}
      dragHandleClassName="drag-handle"
      onDragStop={(_, data) => onPositionChange({ x: data.x, y: data.y })}
      className="pointer-events-auto"
    >
      {multiline ? (
        <textarea
          value={value}
          readOnly={readOnly}
          onChange={(e) => onValueChange(e.target.value)}
          className="drag-handle h-full w-full resize-none rounded border border-transparent bg-transparent px-2 leading-tight focus:border-slate-300 focus:bg-white/70 focus:outline-none"
          style={{ fontSize, textAlign }}
        />
      ) : (
        <input
          value={value}
          readOnly={readOnly}
          onChange={(e) => onValueChange(e.target.value)}
          className="drag-handle h-full w-full rounded border border-transparent bg-transparent px-2 focus:border-slate-300 focus:bg-white/70 focus:outline-none"
          style={{ fontSize, textAlign }}
        />
      )}
    </Rnd>
  );
}

