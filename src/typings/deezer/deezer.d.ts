// Type definitions for Deezer SDK
// Project: http://e-cdn-files.deezer.com/js/min/dz.js
// Definitions by: Cayet Nicolas

interface DZ {
    init(options: any): void;

    api(url: string, callback: Function): void;

    api(url: string, method: string, body: any, callback: Function): void;

    login(callback: Function, options: any): void;

    logout(callback: Function): void;
}

/** Expose as global variable */
declare var DZ: DZ;