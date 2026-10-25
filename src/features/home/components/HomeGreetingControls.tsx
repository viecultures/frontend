interface HomeGreetingControlsProps {
  userName?: string;
  hasHistory: boolean;
}

export function HomeGreetingControls({ userName = 'Learner', hasHistory }: HomeGreetingControlsProps) {
  return <div className="home-room-greeting">
    <div>
      <p className="home-room-eyebrow">YOUR CULTURE STUDY ROOM</p>
      <h1>{hasHistory ? 'Welcome back' : 'Welcome'}, {userName.split(' ')[0]}.</h1>
      <p>A little English. A little closer to Vietnam.</p>
    </div>
  </div>;
}

