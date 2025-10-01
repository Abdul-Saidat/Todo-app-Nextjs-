"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { ChevronLeft } from "lucide-react";

function Chat() {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    try {
      const apiUrl = "https://api.openai.com/v1/chat/completions";
      const apiKey = process.env.NEXT_PUBLIC_TODO_APP_KEY;
      const headers = {
        "content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      const requestBody = {
        model: "gpt-4o-mini",
        messages: [...messages, { role: "user", content: input }],
      };

      const { data } = await axios.post(apiUrl, requestBody, { headers });
      //   console.log(data.choices[0].message.content);
      const aiResponse = data.choices[0].message.content;
      setResponse(data.choices[0].message.content);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      console.error("error occured sending message:", error);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <>
      <div className="w-full max-w-lg mx-auto py-7 px-5">
        <h1 className="text-center text-2xl">Simple Chat-Page</h1>
        <button onClick={() => router.push("/")} className="cursor-pointer">
          <ChevronLeft />
        </button>
        <div className="py-5">
          {messages.map((msg, index) => (
            <div
              className={`rounded-md flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } `}
              key={index}
            >
              <div
                key={index}
                className={
                  msg.role === "user"
                    ? `  text-blue-50 bg-slate-500 border rounded-full w-[350px] max-w-fit px-4 py-2 mb-5`
                    : "text-green-800 mb-5"
                }
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="">
          <p className="text-[14px] text-slate-600">
            Got any questions? type them below and hit the send button
          </p>
          <input
            type="text"
            value={input}
            disabled={loading}
            required={true}
            onChange={(e) => setInput(e.target.value)}
            className="border border-black rounded-sm block  w-full md:max-w-md px-2 py-2"
          />
          <button
            onClick={sendMessage}
            className="text-slate-50 bg-slate-700 hover:bg-slate-800 px-5 py-2 mt-4 rounded-lg cursor-pointer"
          >
            {loading ? "Loading response..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}
export default Chat;
