import React, { useEffect, useRef, useState } from "react";
import { useNickname } from "../context/NicknameContext";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);
    const { nickname } = useNickname();
    const navigate = useNavigate();

    const [connected, setConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [badWordCount, setBadWordCount] = useState(0);
    const [showParticipants, setShowParticipants] = useState(false);

    // 욕설 횟수 초기 로딩
    useEffect(() => {
        const fetchBadWordCount = async () => {
            try {
                const response = await fetch("http://10.0.2.98/api/chat/count");
                if (response.ok) {
                    const data = await response.json();
                    setBadWordCount(data);
                } else {
                    console.error("욕설 횟수 요청 실패");
                }
            } catch (error) {
                console.error("욕설 횟수 요청 중 에러:", error);
            }
        };

        fetchBadWordCount();
    }, []);

    useEffect(() => {
        if (!nickname) {
            alert("닉네임이 없습니다. 닉네임 입력 후 입장해 주세요.");
            navigate("/");
            return;
        }

        socketRef.current = new WebSocket("ws://10.0.2.98/ws/chat");

        socketRef.current.onopen = () => {
            socketRef.current.send(
                JSON.stringify({ type: "ENTER", sender: nickname })
            );
        };

        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "PARTICIPANTS") {
                    if (Array.isArray(data.participants)) {
                        setParticipants(data.participants);
                    }
                    return;
                }

                if (data.type === "ERROR") {
                    alert(data.content || "인원 초과, 잠시만 기다려주세요...");
                    socketRef.current.close();
                    navigate("/");
                    return;
                }

                const { type, sender, time } = data;

                if (type === "ENTER") {
                    if (sender === nickname) {
                        setConnected(true);
                    }

                    setParticipants((prev) =>
                        !prev.includes(sender) ? [...prev, sender] : prev
                    );
                    setMessages((prev) => [
                        ...prev,
                        {
                            sender: "system",
                            content: `${sender}님이 입장하셨습니다.`,
                            time,
                        },
                    ]);
                } else if (type === "LEAVE") {
                    setParticipants((prev) => prev.filter((p) => p !== sender));
                    setMessages((prev) => [
                        ...prev,
                        {
                            sender: "system",
                            content: `${sender}님이 퇴장하셨습니다.`,
                            time,
                        },
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
                console.error("웹소켓 메시지 파싱 오류:", err);
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

    const sendMessage = () => {
        if (input.trim()) {
            const time = new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });

            const messageData = {
                type: "TALK",
                sender: nickname,
                content: input,
                time,
            };

            socketRef.current.send(JSON.stringify(messageData));
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
            <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
                <button
                    className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
                    onClick={() => setShowParticipants(!showParticipants)}
                >
                    참여자
                </button>
                <div className="text-red-600 font-bold text-sm">
                    욕설: {badWordCount}
                </div>
            </div>

            {/* 참여자 목록 */}
            {showParticipants && (
                <div className="p-3 bg-blue-50 border-b">
                    <h3 className="font-semibold text-sm mb-2">👥 참여자 ({participants.length})</h3>
                    <div className="flex flex-wrap gap-1">
                        {participants.map((p, idx) => (
                            <span key={idx} className="bg-blue-100 px-2 py-1 rounded text-xs">
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* 채팅 영역 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${
                            msg.sender === nickname
                                ? "justify-end"
                                : msg.sender === "system"
                                    ? "justify-center"
                                    : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-xs p-2 rounded-lg text-sm ${
                                msg.sender === nickname
                                    ? "bg-blue-500 text-white"
                                    : msg.sender === "system"
                                        ? "bg-yellow-100 text-gray-700 text-xs"
                                        : "bg-gray-200 text-black"
                            }`}
                        >
                            {msg.sender !== "system" && msg.sender !== nickname && (
                                <div className="text-xs font-semibold mb-1">{msg.sender}</div>
                            )}
                            <div>{msg.content}</div>
                            {msg.time && (
                                <div className={`text-xs mt-1 ${
                                    msg.sender === nickname ? "text-blue-100" : "text-gray-500"
                                }`}>
                                    {msg.time}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className="flex p-3 bg-gray-50 border-t">
                <input
                    className="flex-1 p-2 border rounded-l-md text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지 입력..."
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 text-sm"
                >
                    전송
                </button>
            </div>
        </div>
    );
};

export default ChatPage;