export const apiUrl = process.env.LOCAL_DEV === 'true' ? 'http://localhost:3000' : 'https://api.translatesubtitles.org';
//export const baseUrl = process.env.LOCAL_DEV === 'true' ? 'http://localhost:3000' : 'https://api.translatesubtitles.org';
export const auth0Cfg = {
    "domain": "translatesubtitles.eu.auth0.com",
    "clientId": "Yl7KeMwXe4zeLMPz9zIHc33Nircfgxh1",
    authorizationParams: {
        redirect_uri: 'http://localhost:1234',
        audience: 'https://translatesubtitles',
    }
}