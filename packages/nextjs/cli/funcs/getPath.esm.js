import { join, relative, resolve } from 'node:path';
import { z } from 'zod';
import { PathStructure } from './PathStructure.esm';

export const getPath = async ({ input }) => {
    const pkJson = new PathStructure({
        input,
        anchorFile: 'openapi.ts',
    }).create();

    const relativePath = relative(__dirname, resolve());

    const SwaggerPathsStop = pkJson.map(async (method) => {
        const openapiSchemas = await import(join(relativePath, method, 'openapi.ts'));

        const path = method
            .replace('app', '')
            .split('/')
            .filter((item) => !item.includes('(') && !item.includes(')'))
            .map((item) => item.replaceAll('[', '{').replaceAll(']', '}'))
            .join('/');

        const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

        const paths = Object.entries(openapiSchemas)
            .filter(([K]) => httpMethods.includes(K))
            .map(([K, openapiSchemas]) => {
                console.log('K', K);
                const method = K.toLowerCase();
                const schema = openapiSchemas;

                const registerPath = {
                    method,
                    path,
                    responses: {
                        200: {
                            description: 'default',
                            content: {
                                'application/json': {
                                    schema: z.object({}),
                                },
                            },
                        },
                    },
                    ...schema,
                };

                return registerPath;
            });

        return paths;
    });

    const SwaggerPaths = await Promise.all(SwaggerPathsStop);

    return SwaggerPaths.flat();
};
