const toSearchParams = (obj: Record<string, any>) => {
    const params = new URLSearchParams();

    Object.entries(obj).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
            value.forEach(v => params.append(key, String(v)));
        } else {
            params.set(key, String(value));
        }
    });

    return params;
}

export { toSearchParams };
