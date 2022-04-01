// import createDRAWEXE from "./DRAWEXE.js";

class CreateModule {
    constructor() {
        this.module = null;
        this.loading = false;
        this.messageData = [];
        // this.getInstance();
    }
    static async getInstance(func) {
        if (!this.instance) {
            this.instance = this;
            this.loading = true;
            const module = await window.createDRAWEXE({
                noExitRuntime: true,
                print: func,
                canvas: window.document.getElementById('occViewerCanvas')
            })
            this.instance.loading = false;
            this.instance.module = module;

            return module;

        }
        return this.instance.module
    }
    static recordMessage(str) {
        this.messageData.push(str);
    }
}

export default CreateModule;