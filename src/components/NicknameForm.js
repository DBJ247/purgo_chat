import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNickname } from "../context/NicknameContext";

const NicknameForm = () => {
  const [input, setInput] = useState("");
  const { setNickname } = useNickname();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      alert("닉네임을 입력하세요.");
      return;
    }
    localStorage.setItem("nickname", trimmed);
    setNickname(trimmed);
    navigate("/chat");
  };

  return (
    <div
      className="w-[320px] rounded-[12px] bg-white p-8 text-[#111111]"
      style={{ backgroundColor: "rgb(255,255,255)" }}
    >
      <p className="text-center text-[24px] leading-[32px] font-bold">
        닉네임 입력
      </p>
      <form className="mt-[24px]" onSubmit={handleSubmit}>
        <div className="mt-[4px] text-[16px] leading-[20px]">
          <input
            type="text"
            name="nickname"
            id="nickname"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="w-full rounded-[16px] border border-[rgba(55,65,81,1)] bg-white p-[12px_16px] text-[#111111] outline-none focus:border-[rgba(167,139,250,1)]"
          />
        </div>
        <button
          type="submit"
          className="block w-full bg-[#8DD8FF] p-[12px] text-center text-[rgb(234,234,234)] font-semibold mt-[24px] rounded-[6px] cursor-pointer transition-colors duration-200 hover:bg-[#4E71FF]"
        >
          입장
        </button>
      </form>
    </div>
  );
};

export default NicknameForm;