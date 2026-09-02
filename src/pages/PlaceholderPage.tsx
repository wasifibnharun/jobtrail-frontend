interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({
  title,
}: PlaceholderPageProps) {
  return (
    <section className="page">
      <h1>{title}</h1>
    </section>
  );
}