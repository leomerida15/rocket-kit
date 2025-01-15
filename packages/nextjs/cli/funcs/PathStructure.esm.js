import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

export class PathStructure {
    obj = {};

    app_path;

    ignore = [];

    SetPath = new Set();

    anchorFile = '';

    input = '';

    urlFormat(url) {
        return url
            .split('/')
            .filter((item) => !item.includes('('))
            .join('/')
            .replace(resolve(this.app_path), '');
    }

    constructor({ input, ignore, anchorFile }) {
        this.app_path = resolve(input); // Ruta del directorio app de Next.js
        this.anchorFile = anchorFile;
        if (ignore) this.ignore = ignore;
        this.input = input;
    }

    create() {
        this.readFolders(this.app_path);

        return Array.from(this.SetPath);
    }

    readFolders(currentPath) {
        const archivos = readdirSync(currentPath); // Obtener archivos y carpetas de la ruta actual

        if (archivos.includes(this.anchorFile)) {
            this.SetPath.add(join(this.input, this.urlFormat(currentPath) || '/'));
        }

        const folders = archivos.filter(
            (archivo) => !archivo.includes('.') && !this.ignore.includes(archivo),
        );

        for (const dir of folders) {
            const rutaDir = join(currentPath, dir);
            // const stats = statSync(rutaDir);

            this.readFolders(rutaDir);
        }
    }
}
