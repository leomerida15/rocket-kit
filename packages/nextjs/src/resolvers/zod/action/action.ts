import { ZodError, ZodType, ZodTypeDef } from 'zod';

// Sobrecargas de la función zodAction
export function zodAction<S extends ZodType<any, ZodTypeDef, any>, R extends any>(params: {
    schema?: S;
    handler: (props: Zod.infer<S>) => Promise<R>;
}): (props: Zod.infer<S>) => Promise<{
    data: R;
    success: boolean;
    error?: ZodError<Zod.infer<S>>;
}>;
export function zodAction<S extends ZodType<any, ZodTypeDef, any>, R extends any>(params: {
    schema?: S;
    handler: (props: Zod.infer<S>) => R;
}): (props: Zod.infer<S>) => {
    data: R;
    success: boolean;
    error?: ZodError<Zod.infer<S>>;
};

// Implementación de la función zodAction
export function zodAction<S extends ZodType<any, ZodTypeDef, any>, R extends any>({
    schema,
    handler,
}: {
    schema?: S;
    handler: (props: Zod.infer<S>) => R | Promise<R>;
}) {
    return (props: Zod.infer<S>) => {
        const validResp = schema?.safeParse(props);

        if (!validResp?.success) return { ...validResp, data: null, success: false };

        const result = handler(validResp.data);

        if (result instanceof Promise) {
            return result
                .then((reply) => ({ ...validResp, data: reply, success: true }))
                .catch((error) => ({ ...error, data: null, success: false }));
        }

        return { ...validResp, data: result, success: true };
    };
}
