declare module "drawexe-lib" {
    interface Lib {
        drawEval(cmd: string): number;
    }
    export default function initialize(): Promise<Lib>;
}