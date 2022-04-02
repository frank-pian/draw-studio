// import createDRAWEXE from "./DRAWEXE.js";

class DrawexeModule {
    constructor() {
        this.module = null;
        this.loaded = false;
        this.drawModule = [];
        // this.getInstance();
    }
    static async getInstance(func) {
        if (!this.instance) {
            this.instance = this;
            const module = await window.createDRAWEXE({
                noExitRuntime: true,
                print: func,
                canvas: window.document.getElementById('occViewerCanvas')
            })
            this.instance.loaded = true;
            this.instance.module = module;

            return module;

        }
        return this.instance.module
    }
    static async eval(cmd) {
        if (!this.loaded) {
            return;
        }
        let evalCmd = "";
        if (cmd instanceof Array) {
            evalCmd = cmd.join(" ");
        } else {
            evalCmd = cmd;
        }

        console.log(evalCmd, "[Input]");
        await this.getInstance().then(module => {
            return module.eval(evalCmd);
        });
    }
}

export default DrawexeModule;