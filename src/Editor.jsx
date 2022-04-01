import React, { Component } from 'react';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-tcl";
import "ace-builds/src-noconflict/snippets/tcl";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools"

function onChange(newValue) {
    console.log("change", newValue);
}

class Editor extends Component {
    render() {
        return <AceEditor
            style={{ "width": "100%", "height": "100%" }}
            mode="tcl"
            theme="twilight"
            onChange={onChange}
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