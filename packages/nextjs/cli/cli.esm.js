#!/usr/bin/env node
import { OpenApiGeneratorV3, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { Command } from 'commander';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getPath } from './funcs/getPath.esm';

const program = new Command();

program
    .name('openapi')
    .description('generate openapi by next.js with "app" folder')
    .version('1.0.0');

program
    .command('init')
    .description('Split a string into substrings and display as an array')
    .option('-c, --config', 'path config file by openapi')
    .option('-i, --input', 'path api folder')
    .action(async (str) => {
        const { config, registry } = await import(str.options.config);

        const OpenApiGenerator =
            config.openapi === '3.0.0' ? OpenApiGeneratorV3 : OpenApiGeneratorV31;

        const SwaggerPaths = await getPath(str.options);

        for (const SwaggerPath of SwaggerPaths) {
            registry.registerPath(SwaggerPath);
        }

        const openapiJson = new OpenApiGenerator(registry.definitions).generateDocument(config);

        const content = JSON.stringify(openapiJson);

        writeFileSync(resolve(), content);
    });

program.parse();
