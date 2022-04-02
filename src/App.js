import './App.css';
import Editor from './Editor';
import Console from './Console';
import Viewer from './Viewer';
import { SplitPane } from 'react-multi-split-pane';
import DrawexeModule from './drawexeModule';
function App() {

  return (
    <SplitPane split="vertical"
      minSize={200}
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
  );
}

export default App;