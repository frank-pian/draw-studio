
import React, { useState } from 'react';
import Terminal, { ColorMode, LineType } from 'react-terminal-ui';
import CreateModule from './createModule'
import './Console.css'

function Console() {
    const [terminalLineData, setTerminalLineData] = useState([
        { type: LineType.Output, value: 'Welcome to the Draw Harness Studio!' },
        { type: LineType.Input, value: 'Some previous input received' },
    ]);
    function addLd(str) {
        console.log(str);
        setTerminalLineData(prev => [...prev, { type: LineType.Output, value: str }]);
    }
    function onInput(input) {
        setTerminalLineData(prev => [...prev, { type: LineType.Input, value: input }]);
        if (input.toLocaleLowerCase() === 'clear') {
            setTerminalLineData([]);
        }
        CreateModule.getInstance(addLd).then(module => {
            module.eval(input);
        });
    }
    return (
        <Terminal
            colorMode={ColorMode.Dark}
            lineData={terminalLineData}
            onInput={onInput}
        />
    )
}

export default Console;