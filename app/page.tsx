import { HomeContent } from './components/home-content';

export default function HomePage() {
  // HomeContent handles auth redirect on the client side
  // This allows immediate redirect when user authenticates
  return <HomeContent />;
}
