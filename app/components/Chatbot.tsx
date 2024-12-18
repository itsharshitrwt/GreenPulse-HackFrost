"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const containerControls = useAnimation();
  const textControls = useAnimation();
  const [containerRef, inViewContainer] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inViewContainer) {
      containerControls.start("visible");
      textControls.start("visible");
    }
  }, [inViewContainer, containerControls, textControls]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();
      if (response.ok) {
        const botMessage: Message = {
          id: Date.now() + 1,
          sender: "bot",
          text: data.response,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          id: Date.now() + 1,
          sender: "bot",
          text: data.error || "Something went wrong",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error("Error fetching chats", err);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Something went wrong unexpectedly",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        ref={containerRef}
        className="text-xl md:text-[80px] text-[30px] font-bold text-center text-black md:mb-16 mb-7"
        initial="hidden"
        animate={containerControls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.8 }}
      >
        Ask Green<span className="bg-green-500 ml-2">Pulse AI</span>
      </motion.div>

      <motion.p
        className="hidden md:block abril-font mx-auto text-justify justify-center items-center w-[77%] text-2xl md:font-bold text-black mb-5 bg-white px-12 py-5 rounded-5xl"
        initial="hidden"
        animate={textControls}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        Prakriti, is your intelligent companion for all environmental queries.
        Prakriti, meaning nature in Hindi, <span className="bg-green-500 ml-2">empowers you with insights on sustainable living,</span> conservation practices, and eco-friendly solutions. Prakriti AI is here to guide you towards a greener lifestyle. It provides <span className="bg-green-500">personalized recommendations and valuable information</span> to help you make informed choices for a healthier planet, <span className="bg-green-500">Say Hi!</span> to Prakriti.
      </motion.p>

      <motion.div
        className="flex flex-col h-[60vh] md:h-screen bg-green-500 md:w-[190vh] w-[48vh] mx-auto mb-16 border-2 border-black opacity-90"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1709147854339-b98a3abf8516?fm=jpg&amp;q=60&amp;w=3000&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2hlJTIwdHJlZXxlbnwwfHx8fDE2ODQ5MTYyNjI&amp;auto=format')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        initial="hidden"
        animate={containerControls}
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 },
        }}
        transition={{ duration: 3 }}
      >
        <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`rounded-lg border-2 border-black px-4 py-2 max-w-xl ${
                  msg.sender === "user"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start mb-4">
              <div className="flex space-x-1">
                <span className="block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="block w-2 h-2 bg-green-400 rounded-full animate-pulse delay-200"></span>
                <span className="block w-2 h-2 bg-green-400 rounded-full animate-pulse delay-400"></span>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex p-4 bg-white shadow-md max-w-2xl mx-auto rounded-lg mb-10 md:w-[150vh] border-2 border-black"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-green-500 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
            disabled={loading}
          />
          <button
            type="submit"
            className="ml-4 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 focus:outline-none disabled:bg-green-800 "
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 2.632a3 3 0 001.11 0L21 8M5 19h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z"
              />
            </svg>
          </button>
        </form>
      </motion.div>
    </>
  );
};

export default ChatPage;
