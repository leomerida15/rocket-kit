import { readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export class PathStructure {
    entry: string[] = [];

    obj: any = {};

    app_path: string;
    output_path: string;

    ignore: string[] = [];

    anchorFile: string = '';

    urlFormat(url: string) {
        return url
            .split('/')
            .filter((item) => !item.includes('('))
            .join('/')
            .replace(resolve(this.app_path), '');
    }

    constructor({
        input,
        output,
        ignore,
        anchorFile,
    }: {
        input: string;
        output: string;
        ignore: string[];
        anchorFile: string;
    }) {
        this.app_path = resolve(input); // Ruta del directorio app de Next.js
        this.output_path = resolve(output); // Ruta de la carpeta donde se generarán los archivos de rutas
        this.ignore = ignore;
        this.anchorFile = anchorFile;
    }

    create() {
        this.readFolders(this.app_path);

        this.crearObj();

        this.createFile();
    }

    readFolders(currentPath: string) {
        const archivos = readdirSync(currentPath); // Obtener archivos y carpetas de la ruta actual

        if (archivos.includes(this.anchorFile)) {
            this.entry.push(this.urlFormat(currentPath));
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

    crearObj() {
        for (const cadena of this.entry) {
            const keys = cadena.split('/');
            keys.shift();

            let currentObj = this.obj;

            // Recorrer cada campo y crear la estructura del objeto
            for (const key of keys) {
                if (!currentObj[key.replace(/\[|\]/g, '')])
                    currentObj[key.replace(/\[|\]/g, '')] = {};

                if (key === keys.at(-1)) {
                    currentObj[key.replace(/\[|\]/g, '')] = { root: cadena };
                }

                currentObj = currentObj[key.replace(/\[|\]/g, '')]; // Avanzar al siguiente nivel del objeto
            }
        }
    }

    createFile() {
        const content = `export const Urls = () => (${JSON.stringify(this.obj)});`;

        writeFileSync(this.output_path, content);
    }
}
