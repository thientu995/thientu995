const redirectHttpCode = 301
const hostnameRedirect = 'tunt.net'
const redirectMap = `https://${hostnameRedirect}`

export async function onRequest(context) {
    const url = new URL(context.request.url)
    const { hostname } = url

    if (hostname != hostnameRedirect) {
        return Response.redirect(redirectMap, redirectHttpCode)
    }
    return await context.next();
}