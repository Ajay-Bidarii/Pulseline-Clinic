export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-clinic-50 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-clinic-500" />
        </div>
      )}
      <h4 className="font-display font-semibold text-ink-900 mb-1">{title}</h4>
      {description && <p className="text-sm text-ink-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
