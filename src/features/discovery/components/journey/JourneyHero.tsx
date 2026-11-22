interface JourneyHeroProps {
  title: string;
  lead: string;
}

export function JourneyHero({ title, lead }: JourneyHeroProps) {
  return (
    <header className="journey-hero">
      <div className="journey-hero-content">
        <h1>{title}</h1>
        <p>{lead}</p>
      </div>
    </header>
  );
}
