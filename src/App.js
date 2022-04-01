import { useEffect } from 'react'
import './App.css';
import Editor from './Editor';
import Console from './Console';
import Viewer from './Viewer';
import { SplitPane } from 'react-multi-split-pane';
import CreateModule from './createModule';
function App() {

  useEffect(() => {

  }, [])

  return (
    <SplitPane split="vertical"
      minSize={200}
      defaultSize={100}
      onDragFinished={(size) => {
        CreateModule.getInstance().then(module => {
          console.log(`vinit -width ${parseInt(size[1])}`)
          module.eval(`vinit -width ${parseInt(size[1])}`);
        });
      }}
    >
      <Editor></Editor>
      <SplitPane split="horizontal" defaultSize={100}>
        <Viewer></Viewer>
        <Console />
      </SplitPane>
    </SplitPane>
  );
}

export default App;