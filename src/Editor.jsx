import React, { Component } from 'react';
import AceEditor from "react-ace";
import PubSub from 'pubsub-js';
import DrawexeModule from './drawexeModule';

import "ace-builds/src-noconflict/mode-tcl";
import "ace-builds/src-noconflict/snippets/tcl";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools"

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        }
        this.updateText = this.updateText.bind(this)
    }
    updateText(newValue) {
        console.log("change", newValue);
        this.setState({
            text: newValue
        });
    }
    componentDidMount() {
        console.log("all", this.state.text);
        this.token = PubSub.subscribe("/editor/runCode", () => {
            const codeFile = new File([this.state.text], "code.tcl", {
                type: "text/plain",
            });
            DrawexeModule.uploadFile(codeFile, "", true, () => {
                DrawexeModule.eval(['source', 'code.tcl']);
            });

        });
    }
    render() {
        return <AceEditor
            style={{ "width": "100%", "height": "100%" }}
            mode="tcl"
            theme="twilight"
            onChange={this.updateText}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showPrintMargin: false
            }}
        />;
    }
}
export default Editor;