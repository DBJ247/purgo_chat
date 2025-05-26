import React from "react";
import NicknameForm from "../components/NicknameForm";
import IPhoneMockup from "../Mockup/IPhoneMockup";

const NicknamePage = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-[#C2DFFF] overflow-hidden">
            <IPhoneMockup>
                <div className="flex flex-col h-full w-full max-w-sm mx-auto bg-white pt-6 px-6 justify-start pb-6">
                    <div className="mt-[54%]">
                        <NicknameForm />
                    </div>
                </div>
            </IPhoneMockup>
        </div>
    );
};

export default NicknamePage;