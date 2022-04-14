import React, { useState } from 'react';
import Header from './Header';
import Editor from './Editor';
import Console from './Console';
import Viewer from './Viewer';
import { SplitPane } from 'react-multi-split-pane';
import DrawexeModule from './drawexeModule';
import './App.css';
function App() {
  const [debugStatus, setDebugStatus] = useState(false);

  function getCanvasSize() {
    const canvasRect = document.getElementById("occViewerCanvas").getBoundingClientRect();
    DrawexeModule.eval(['vinit', '-width', parseInt(canvasRect.width), '-height', parseInt(canvasRect.height)]);
    //DrawexeModule.eval('vfit');
  }

  return (
    <div className='body'>
      <Header debugStatus={debugStatus}></Header>
      <SplitPane
        split="vertical"
        // className='main-warp'
        minSize={100}
        defaultSize={100}
        onDragFinished={(size) => {
          // DrawexeModule.eval(['vinit', '-width', parseInt(getCanvasSize().width)]);
          // DrawexeModule.eval('vfit');
          getCanvasSize();
        }}
      >
        <Editor onState={setDebugStatus}></Editor>
        <SplitPane
          split="horizontal"
          defaultSize={100}
          onDragFinished={(size) => {
            // DrawexeModule.eval(['vinit', '-height', parseInt(size[0])]);
            // DrawexeModule.eval('vfit');
            getCanvasSize();
          }}
        >
          <Viewer></Viewer>
          <Console />
        </SplitPane>
      </SplitPane>
    </div>
  );
}

export default App;