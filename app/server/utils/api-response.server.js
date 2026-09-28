export function apiSuccess(data, status = 200) {
    return Response.json({ ok: true, data }, { status });
}
export function apiError(message, status, details) {
    return Response.json({ ok: false, error: message, ...(details === undefined ? {} : { details }) }, { status });
}
