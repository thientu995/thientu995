const redirectHttpCode = 301
const redirectMap = 'https://t4vn.com'
const hostnameExclude = 'pages.dev'
const lengthHostName = hostnameExclude.split('.').length + 1

export async function onRequest(context) {
    const url = new URL(context.request.url)
    const { hostname } = url

    if (hostname.substring(hostname.lastIndexOf(hostnameExclude)) === hostnameExclude) {
        if (hostname.split('.').length === lengthHostName) {
            return Response.redirect(redirectMap, redirectHttpCode)
        }
    }
    return await context.next();
}