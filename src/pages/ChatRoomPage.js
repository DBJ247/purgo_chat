import React, { useEffect, useRef, useState } from "react";
import { useNickname } from "../context/NicknameContext";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);
    const { nickname, resetNickname } = useNickname();
    const navigate = useNavigate();

    const [connected, setConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [badWordCount, setBadWordCount] = useState(0);
    const [showParticipants, setShowParticipants] = useState(false);

    const handleLeave = () => {
        if (socketRef.current) socketRef.current.close();
        resetNickname();
        navigate("/");
    };

    useEffect(() => {
        const fetchBadWordCount = async () => {
            try {
                const response = await fetch("http://43.202.183.36/api/chat/count");
                if (response.ok) {
                    const data = await response.json();
                    setBadWordCount(data);
                }
            } catch (error) {
                console.error("요응 회수 요청 에러:", error);
            }
        };
        fetchBadWordCount();
    }, []);

    useEffect(() => {
        if (!nickname) {
            if (!connected) {
                alert("닉네임이 없습니다. 닉네임 입력 후 입장해 주세요.");
                navigate("/");
            }
            return;
        }

        socketRef.current = new WebSocket("ws://43.202.183.36/ws/chat");

        socketRef.current.onopen = () => {
            socketRef.current.send(JSON.stringify({ type: "ENTER", sender: nickname }));
        };

        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "PARTICIPANTS" && Array.isArray(data.participants)) {
                    setParticipants(data.participants);
                    return;
                }

                if (data.type === "ERROR") {
                    alert(data.content || "인원 초과, 잠시만 기다려주세요...");
                    socketRef.current.close();
                    navigate("/");
                    return;
                }

                const { type, sender } = data;

                if (type === "ENTER") {
                    if (sender === nickname) setConnected(true);
                    setParticipants((prev) =>
                        !prev.includes(sender) ? [...prev, sender] : prev
                    );
                    setMessages((prev) => [
                        ...prev,
                        { sender: "system", content: `${sender}님이 입장하셨습니다.` },
                    ]);
                } else if (type === "LEAVE") {
                    setParticipants((prev) => prev.filter((p) => p !== sender));
                    setMessages((prev) => [
                        ...prev,
                        { sender: "system", content: `${sender}님이 퇴장하셨습니다.` },
                    ]);
                } else if (type === "TALK") {
                    setMessages((prev) => [...prev, data]);
                    if (typeof data.badWordCount === "number") {
                        setBadWordCount(data.badWordCount);
                    }
                    setParticipants((prev) =>
                        !prev.includes(sender) ? [...prev, sender] : prev
                    );
                }
            } catch (err) {
                console.error("웹소스 메시지 파싱 오류:", err);
            }
        };

        socketRef.current.onclose = () => {
            console.log("웹소켓 연결 종료");
        };

        return () => {
            socketRef.current.close();
        };
    }, [nickname, navigate]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (connected) {
            inputRef.current?.focus();
        }
    }, [connected]);

    const sendMessage = () => {
        if (input.trim()) {
            const time = new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });

            socketRef.current.send(
                JSON.stringify({ type: "TALK", sender: nickname, content: input, time })
            );
            setInput("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!connected) {
        return (
            <div className="flex justify-center items-center h-full text-sm text-gray-600">
                입장 확인 중...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full max-w-sm mx-auto bg-white">
            {/* 헤더 */}
            <div className="sticky top-0 z-10 bg-[#f4f4f4] px-4 pt-12 pb-3 shadow-sm">
                <div className="flex justify-between items-center">
                    <img
  src="/images/exit.png"
  alt="나가기"
  onClick={handleLeave}
  className="w-6 h-6 cursor-pointer hover:opacity-70"
/>
                    <div className="flex items-center gap-2">
                        <button
                            className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-md hover:bg-gray-200"
                            onClick={() => setShowParticipants(!showParticipants)}
                        >
                            👥 참여자
                        </button>
                        <span className="text-sm font-semibold text-gray-700">
                             욕설: <span className="text-red-500">{badWordCount}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* 참여자 목록 */}
            {showParticipants && (
                <div className="p-3 bg-gray-300/50 backdrop-blur-sm absolute top-[5.5rem] left-[1px] w-[calc(100%-2px)] z-10 ">
                    <h3 className="font-semibold text-sm mb-2">👥 참여자 ({participants.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {participants.map((p, idx) => (
                            <span
                                key={idx}
                                className="bg-blue-100 px-3 py-1 rounded-full text-xs text-blue-800"
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* 채팅 메시지 영역 */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 relative z-0">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col ${
                            msg.sender === nickname
                                ? "items-end"
                                : msg.sender === "system"
                                ? "items-center"
                                : "items-start"
                        }`}
                    >
                        {/* 상대방 닉네임 표시 */}
                        {msg.sender !== "system" && msg.sender !== nickname && (
                            <div className="text-xs font-normal text-gray-700 mb-0.5 ml-2">
                                {msg.sender}
                            </div>
                        )}

                        <div
                            className={`relative max-w-xs px-3 py-2 text-base rounded-2xl shadow ${
                                msg.sender === nickname
                                    ? "bg-[#34C759] text-white self-end rounded-br-sm font-normal"
                                    : msg.sender === "system"
                                    ? "bg-transparent text-gray-400 italic text-center font-normal"
                                    : "bg-[#E8E9EB] text-black self-start rounded-bl-sm font-normal"
                            }`}
                        >
                            <div>{msg.content}</div>
                            {msg.time && msg.sender !== "system" && (
                                <div
                                    className={`text-[10px] text-right mt-0.5 ${
                                        msg.sender === nickname ? "text-white" : "text-gray-500"
                                    }`}
                                >
                                    {msg.time}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* 입력창 */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white border-t shadow-inner">
                <input
                    ref={inputRef}
                    className="flex-1 p-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="메시지를 입력하세요..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-[#34C759] text-white font-normal rounded-full text-base hover:bg-green-500 transition"
                >
                    전송
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
