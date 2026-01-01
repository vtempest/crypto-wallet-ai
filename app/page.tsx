import ChatWindow from '@/components/research/chat/ChatWindow';
import { Metadata } from 'next';
import { getBackgroundArtwork } from '@/lib/home/background-art';

export const metadata: Metadata = {
  title: 'Chat - QwkSearch',
  description: 'Search, extract, vectorize, outline graph, and monitor the web for a topic.',
};

const Home = () => {
  const background = getBackgroundArtwork();
  return <ChatWindow background={background} />;
};

export default Home;
