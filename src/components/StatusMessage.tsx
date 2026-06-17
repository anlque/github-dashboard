type StatusMessageProps = {
  title: string;
  description: string;
  tone?: 'neutral' | 'danger';
};

export function StatusMessage({
  title,
  description,
  tone = 'neutral',
}: StatusMessageProps) {
  return (
    <section className={`status-message status-message--${tone}`}>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}
