import React from "react";
import NicknameForm from "../components/NicknameForm";

const NicknamePage = () => {
    return (
        <div className="flex flex-col h-full w-full max-w-sm mx-auto bg-white pt-6 px-6 justify-start pb-6">
            <div className="mt-[54%]">
                <NicknameForm />
            </div>
        </div>
    );
};

export default NicknamePage;