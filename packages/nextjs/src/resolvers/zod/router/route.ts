import { NextRequest, NextResponse } from 'next/server';
import { TypeOf, ZodObject, ZodType, ZodTypeDef } from 'zod';
import { requestFactory } from './requestFactory';
import { responseFactory } from './responseFactory';
import { IZodRouteParams } from './types';

export const zodRoute = <
    B extends ZodType<any, ZodTypeDef, any>,
    C extends ZodObject<any>,
    Q extends ZodObject<any>,
    H extends ZodObject<any>,
    R extends ZodType<any, ZodTypeDef, any>,
>(
    P: IZodRouteParams<B, C, Q, H, R> | IZodRouteParams<B, C, Q, H, R>['Handler'],
) => {
    const controllerFactory = async (nextRequest: NextRequest, context: TypeOf<C>) => {
        try {
            const { schemas, Handler } = ((): {
                schemas?: IZodRouteParams<B, C, Q, H, R>['schemas'];
                Handler: IZodRouteParams<B, C, Q, H, R>['Handler'];
            } => {
                if (typeof P === 'object')
                    return {
                        schemas: P.schemas,
                        Handler: P.Handler,
                    };

                return {
                    Handler: P,
                };
            })();

            const req = await requestFactory<B, C, Q, H, R>(nextRequest, context, schemas);

            const reply = responseFactory(schemas?.response);

            return Handler(req, reply, context);
        } catch (error) {
            return NextResponse.json((error as any).errors, {
                status: 400,
            }) as Response;
        }
    };

    return controllerFactory;
};
