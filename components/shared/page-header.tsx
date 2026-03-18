type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: Props) {
  return (
    <div className="flex items-start justify-between mb-8 pb-8 border-b border-zinc-200">
      <div>
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1">StayDirect</p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        {description && (
          <p className="text-sm text-zinc-500 mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}