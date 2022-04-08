import React from 'react';
import './Header.css';
import PubSub from 'pubsub-js';
import DrawexeModule from './drawexeModule';

function Header() {
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
    return (
        <div className='Header'>
            <span className='title'>Draw Harness Studio</span>
            <div className='button run' onClick={clickRun}>Run</div>
            <div className='button upload-wrap' onClick={upBtn}>
                Upload
                <input type="file" id="upload-file" onChange={upChange} />
            </div>
        </div >
    )
}

export default Header;