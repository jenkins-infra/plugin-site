export default function forceArray(values) {
    if (!Array.isArray(values)) { return [values]; }
    return values;
}
