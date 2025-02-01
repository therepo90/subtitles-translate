let auth0Client = null;

export const getAuth0Client = () => {
    return auth0Client;
}
export const auth0Cfg = {
    "domain": "translatesubtitles.eu.auth0.com",
    "clientId": "Yl7KeMwXe4zeLMPz9zIHc33Nircfgxh1"
}

export const configureClient = async () => {
    console.log('configureClient');
    const config = auth0Cfg;

    auth0Client = await auth0.createAuth0Client({
        domain: config.domain,
        clientId: config.clientId
    });
};

export const  updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();

    document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-login").disabled = isAuthenticated;

    // NEW - add logic to show/hide gated content after authentication
    if (isAuthenticated) {

        //document.getElementById("upload-unauth").classList.add("hidden");
        //document.getElementById("upload-container").classList.remove("hidden");
        document.getElementById("gated-content").classList.remove("hidden");

        document.getElementById(
            "ipt-access-token"
        ).innerHTML = await auth0Client.getTokenSilently();

        document.getElementById("ipt-user-profile").textContent = JSON.stringify(
            await auth0Client.getUser()
        );

    } else {
        //document.getElementById("upload-unauth").classList.remove("hidden");
        //document.getElementById("upload-container").classList.add("hidden");
        document.getElementById("gated-content").classList.add("hidden");
    }
};

// ..

window.login = async () => {
    await auth0Client.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    });
};

window.logout = () => {
    auth0Client.logout({
        logoutParams: {
            returnTo: window.location.origin
        }
    });
};