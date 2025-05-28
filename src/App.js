import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NicknamePage from "./pages/NicknamePage";
import ChatRoomPage from "./pages/ChatRoomPage";
import { NicknameProvider, useNickname } from "./context/NicknameContext";
import IPhoneMockup from "./Mockup/IPhoneMockup";

const ProtectedRoute = ({ children }) => {
    const { nickname } = useNickname();
    if (!nickname) {
        return <Navigate to="/" />;
    }
    return children;
};

const App = () => {
    return (
        <NicknameProvider>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div className="bg-[#C2DFFF] min-h-screen relative flex justify-center items-center">
                                {/* PURGO 링크 */}
                                <a
                                    href="http://purgo.kro.kr/detail#second"
                                    className="absolute bottom-4 left-4 px-4 py-2 bg-white text-blue-600 font-bold rounded-full shadow hover:bg-blue-100 transition cursor-pointer z-50"
                                >
                                    PURGO
                                </a>

                                <IPhoneMockup>
                                    <NicknamePage />
                                </IPhoneMockup>
                            </div>
                        }
                    />
                    <Route
                        path="/chat"
                        element={
                            <div className="bg-[#C2DFFF] min-h-screen relative flex justify-center items-center">
                                {/* PURGO 링크 */}
                                <a
                                    href="http://purgo.kro.kr/detail#second"
                                    className="absolute bottom-4 left-4 px-4 py-2 bg-white text-blue-600 font-bold rounded-full shadow hover:bg-blue-100 transition cursor-pointer z-50"
                                >
                                    PURGO
                                </a>

                                <IPhoneMockup>
                                    <ChatRoomPage />
                                </IPhoneMockup>
                            </div>
                        }
                    />
                </Routes>
            </Router>
        </NicknameProvider>
    );
};

export default App;