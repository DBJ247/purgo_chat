import React from "react";
import NicknameForm from "../components/NicknameForm";
import IPhoneMockup from "../Mockup/IPhoneMockup";

const NicknamePage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen p-4" style={{backgroundColor: '#C2DFFF'}}>
            <IPhoneMockup>
                <div style={{marginTop: '60px'}}>
                    <NicknameForm/>
                </div>
            </IPhoneMockup>
        </div>
    );
};

export default NicknamePage;