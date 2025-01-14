import { OasKeys } from "./docs/types";
import { resolverObj } from "./resolvers";
import { ResolverKeys } from "./resolvers/types";

export * from "./resolvers/types";
export * from "./docs/types";
export * from "./httpStatus";

/**
 * Configuration object for the Rocket-kit.
 *
 * @export
 * @abstract
 * @class ConfigObject
 * @type { resolver: "zod" | "yup" }
 */
export declare abstract class ConfigObject<
	K extends ResolverKeys = "zod",
	O extends OasKeys = "3.1",
> {
	/**
	 * Packet to validate data in the Route.
	 * @default "zod"
	 * @type "zod" | "yup"
	 */
	resolver?: K;

	/**
	 * OpenAPI version.
	 * @default "3.1"
	 * @type "3.0" | "3.1"
	 */
	oas?: O;
}

export interface IResolver {
	zod: typeof resolverObj.zod;
	yup: typeof resolverObj.yup;
}
