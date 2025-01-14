export const formatParams = (params: Record<any, any>) => {
	const paramsEntry = Object.entries(params).map(([key, value]) => {
		// en caso de que sea array
		if (Array.isArray(value)) {
			return value.map((vItem) => {
				const vItemoNumber = Number(vItem);

				if (vItemoNumber !== 0 && !vItemoNumber) {
					return [key, value];
				} else {
					return [key, vItemoNumber];
				}
			});
		}

		const valueToNumber = Number(value);
		if (valueToNumber !== 0 && !valueToNumber) {
			return [key, value];
		} else {
			return [key, valueToNumber];
		}
	});
	return Object.fromEntries(paramsEntry);
};
