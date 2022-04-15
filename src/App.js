import React, { useState, createContext } from 'react';
import Header from './Header';
import Editor from './Editor';
import Console from './Console';
import Viewer from './Viewer';
import { SplitPane } from 'react-multi-split-pane';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DrawexeModule from './drawexeModule';
import { ShowLoading } from './contextManager'
import './App.css';



function App() {
  const [debugStatus, setDebugStatus] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  function getCanvasSize() {
    const canvasRect = document.getElementById("occViewerCanvas").getBoundingClientRect();
    DrawexeModule.eval(['vinit', '-width', parseInt(canvasRect.width), '-height', parseInt(canvasRect.height)]);
    //DrawexeModule.eval('vfit');
  }

  return (
    <ShowLoading.Provider
      value={{ loadingStatus, setLoadingStatus }}>
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
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadingStatus}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </ShowLoading.Provider>
  );
}

export default App;