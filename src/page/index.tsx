import React, { useEffect, useState, useRef, FormEvent } from "react";
import { IoIosSend } from "react-icons/io";
import axios, { AxiosResponse } from "axios";
import Navbar from "../components/navbar";
import Admin from "./../assets/admin.png";
import User from "./../assets/user.jpg";
interface ChatMessage {
  text: string;
  sender: "admin" | "user";
}

const Page: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      text: "haloo ada yang bisa saya bantu?",
      sender: "admin",
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const Admins = "Admin (Bot)";
  const Users = "User";

  useEffect(() => {
    // Scroll to the bottom when chat messages update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  
  const handleSendMessage = async (messageText: string): Promise<void> => {
    try {
      // Send user message
      const response: AxiosResponse<{ chat: ChatMessage[] }> = await axios.post(
        "http://127.0.0.1:3000/chat",
        {
          text: messageText,
        }
      );

      // Update chat messages state with the sent message
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "admin",
          text: `${response.data.chat[0]}`,
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const inputElement = e.currentTarget.elements[0] as HTMLInputElement;
    const messageText = inputElement.value.trim();
    setLoading(true);
    if (messageText) {
      // Update chat messages state with the user message
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: messageText, sender: "user" },
      ]);

      // Send user message
      handleSendMessage(messageText);

      // Clear input
      inputElement.value = "";
    }
  };

  return (
    <>
      <div className="w-full h-full bg-slate-300 text-2xl flex flex-col pt-20">
        <div
          ref={chatContainerRef}
          className="w-full h-screen overflow-y-auto flex flex-col pb-20"
        >
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"} `}
            >
              <div className="chat-image avatar">
                <div className="w-7 rounded-full">
                  <img
                    alt="Avatar"
                    className="bg-white p-1 shadow-xl"
                    src={message.sender === "user" ? User : Admin}
                  />
                </div>
              </div>
              <div className="chat-header text-xs px-3">
                {message.sender === "user" ? Users : Admins}
              </div>
              <div className="chat-bubble text-sm bg-slate-600  shadow-xl">
                {message.text}
              </div>
            </div>
          ))}
          {loading ? (
            <div className={`chat chat-start `}>
              <div className="chat-image avatar">
                <div className="w-7 rounded-full">
                  <img
                    alt="Avatar"
                    className="bg-white p-1 shadow-xl"
                    src={Admin}
                  />
                </div>
              </div>
              <div className="chat-header  text-xs px-3">{Admins}</div>
              <div className="chat-bubble text-sm shadow-xl bg-slate-600 italic">
                <span className="loading loading-dots loading-md"></span>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <form
          className="w-full h-20 bg-slate-700 fixed bottom-0 flex px-6 justify-between items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Apa yang kamu pikirkan?"
            className="w-5/6 h-2/3  rounded-md shadow-md tracking-wider text-sm px-3"
          />
          <button
            type="submit"
            className="btn btn-circle btn-md text-4xl flex items-center justify-center font-bold"
          >
            <IoIosSend />
          </button>
        </form>
        <Navbar />
      </div>
    </>
  );
};

export default Page;
