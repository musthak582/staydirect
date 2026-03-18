type Props = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 border border-dashed border-zinc-300 rounded-xl">
      <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
        <div className="w-4 h-4 border-2 border-zinc-400 rounded-sm" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 text-center max-w-xs mb-5">{description}</p>
      {action}
    </div>
  );
}