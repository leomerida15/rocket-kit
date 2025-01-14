import { ConfigObject, OasKeys, ResolverKeys } from ".";

export const createConfig = <K extends ResolverKeys, O extends OasKeys = "3.1">(
	params?: ConfigObject<K, O>,
) => {
	const resolver = (params?.resolver || "zod") as ResolverKeys;

	const oas = (params?.oas || "3.1") as OasKeys;

	return { resolver, oas };
};
