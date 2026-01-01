import ChatWindow from '@/components/research/chat/ChatWindow';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat - QwkSearch',
  description: 'Search, extract, vectorize, outline graph, and monitor the web for a topic.',
};

const Home = () => {
  return <ChatWindow />;
};

export default Home;
