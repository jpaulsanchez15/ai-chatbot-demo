import ChatWindow from "@/components/ChatWindow";

const Home = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center">
      <h1 className="text-center text-3xl font-bold mb-4">
        Gas Station Troubleshooting Chatbot
      </h1>
      <ChatWindow />
    </main>
  );
};

export default Home;
