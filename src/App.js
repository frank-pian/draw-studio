import Header from './Header';
import Editor from './Editor';
import Console from './Console';
import Viewer from './Viewer';
import { SplitPane } from 'react-multi-split-pane';
import DrawexeModule from './drawexeModule';
import './App.css';
function App() {

  return (
    <div className='body'>
      <Header></Header>
      <SplitPane
        split="vertical"
        // className='main-warp'
        minSize={100}
        defaultSize={100}
        onDragFinished={(size) => {
          DrawexeModule.eval(['vinit', '-width', parseInt(size[1])]);
          DrawexeModule.eval('vfit');
        }}
      >
        <Editor></Editor>
        <SplitPane
          split="horizontal"
          defaultSize={100}
          onDragFinished={(size) => {
            DrawexeModule.eval(['vinit', '-height', parseInt(size[0])]);
            DrawexeModule.eval('vfit');
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