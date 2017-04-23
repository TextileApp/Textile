import { CompilerHost, Program, SourceFile } from 'typescript';
import { FileCache } from '../util/file-cache';
export declare function resolveAppNgModuleFromMain(mainSourceFile: SourceFile, fileCache: FileCache, host: CompilerHost, program: Program): string;
