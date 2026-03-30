export default function Loading({ title }: { title?: string }) {
  return (
    <div className="max-w-full max-h-full flex items-center justify-center">
      <div className=" border-none px-10 py-8 flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="w-10 h-10 border-4  border-t-indigo-500 rounded-full animate-spin" />

        {title && (
          <p className="text-sm text-zinc-400 tracking-wide">{title}...</p>
        )}
      </div>
    </div>
  );
}
