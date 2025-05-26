import React, { createContext, useContext, useState } from "react";

const NicknameContext = createContext();

export const NicknameProvider = ({ children }) => {
    const [nickname, setNickname] = useState("");

    // 닉네임 초기화 함수
    const resetNickname = () => setNickname("");

    return (
        <NicknameContext.Provider value={{ nickname, setNickname, resetNickname }}>
            {children}
        </NicknameContext.Provider>
    );
};

export const useNickname = () => useContext(NicknameContext);
