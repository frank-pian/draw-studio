import React, { useEffect } from 'react';
import './Header.css';
import PubSub from 'pubsub-js';
import DrawexeModule from './drawexeModule';

function Header(props) {
    useEffect(() => {

    });
    const upBtn = () => {
        let btnDom = document.getElementById("upload-file");
        btnDom.click();
    }
    const upChange = (event) => {
        let file = event.target.files[0];
        DrawexeModule.uploadFile(file, "", true)
    }
    const clickRun = () => {
        PubSub.publish("/editor/runCode");
    }
    const clickDebug = () => {
        if (props.debugStatus) {
            PubSub.publish("/editor/debugCode/stop");
        } else {
            PubSub.publish("/editor/debugCode/start");
        }
    }
    const clickContinue = () => {
        PubSub.publish("/editor/debugCode/next");
    }
    return (
        <div className='Header'>
            <span className='title'>Draw Harness Studio</span>
            <div className='button run' onClick={clickRun}>Run</div>
            <div className={props.debugStatus ? "button debug press" : "button debug"} onClick={clickDebug}>{props.debugStatus ? "Stop" : "One Step"}</div>
            <div className='button continue' style={props.debugStatus ? { display: "inline-block" } : { display: "none" }} onClick={clickContinue}>Continue</div>
            <div className='button upload-wrap' onClick={upBtn}>
                Upload
                <input type="file" id="upload-file" onChange={upChange} />
            </div>
        </div >
    )
}

export default Header;