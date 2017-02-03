import 'reflect-metadata';
import { CompilerOptions, ParsedCommandLine, TranspileOutput } from 'typescript';
import AngularCompilerOptions from '@angular/tsc-wrapped/src/options';
import { BuildContext } from '../util/interfaces';
export declare class AotCompiler {
    private context;
    private options;
    private tsConfig;
    private angularCompilerOptions;
    private program;
    private reflector;
    private reflectorHost;
    private compilerHost;
    private fileSystem;
    constructor(context: BuildContext, options: AotOptions);
    compile(): Promise<void>;
    transpileFileContent(fileName: string, sourceText: string, options: CompilerOptions): TranspileOutput;
}
export interface AotOptions {
    tsConfigPath: string;
    rootDir: string;
    entryPoint: string;
}
export declare function getNgcConfig(context: BuildContext, tsConfigPath?: string): ParsedTsConfig;
export interface ParsedTsConfig {
    parsed: ParsedCommandLine;
    ngOptions: AngularCompilerOptions;
}
