export function parseCreateProductInput(value) {
    if (typeof value !== "object" || value === null || !("title" in value)) {
        return null;
    }
    const title = value.title;
    if (typeof title !== "string" || title.trim().length === 0) {
        return null;
    }
    return { title: title.trim() };
}
