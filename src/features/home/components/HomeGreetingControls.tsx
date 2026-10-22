interface HomeGreetingControlsProps {
  userName?: string;
  hasHistory: boolean;
}

export function HomeGreetingControls({ userName = 'Learner', hasHistory }: HomeGreetingControlsProps) {
  const date = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
  return <div className="home-room-greeting">
    <div>
      <p className="home-room-eyebrow">YOUR CULTURE STUDY ROOM</p>
      <h1>{hasHistory ? 'Welcome back' : 'Welcome'}, {userName.split(' ')[0]}.</h1>
      <p>A little English. A little closer to Vietnam.</p>
    </div>
    <p className="home-room-date">{date}</p>
  </div>;
}

