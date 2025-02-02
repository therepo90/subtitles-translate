import {apiUrl, auth0Cfg} from "./cfg";

let auth0Client = null;

export const getAuth0Client = () => {
    return auth0Client;
}

export const configureClient = async () => {
    console.log('configureClient');
    const config = auth0Cfg;

    auth0Client = await auth0.createAuth0Client(config);
};

export const  updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();

    /*document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-login").disabled = isAuthenticated;*/

    // NEW - add logic to show/hide gated content after authentication
    if (isAuthenticated) {

        //document.getElementById("upload-unauth").classList.add("hidden");
        //document.getElementById("upload-container").classList.remove("hidden");
        document.getElementById("gated-content").classList.remove("hidden");
        // all elements with class logged-in are shown
        document.querySelectorAll(".logged-in").forEach(el => el.classList.remove("hidden"));
        document.querySelectorAll(".logged-out").forEach(el => el.classList.add("hidden"));
        // subbed/unsubbed todo
        //const token = await auth0Client.getTokenSilently();

/*
        document.getElementById(
            "ipt-access-token"
        ).innerHTML = await auth0Client.getTokenSilently();

        document.getElementById("ipt-user-profile").textContent = JSON.stringify(
            await auth0Client.getUser()
        );*/
        const token = await auth0Client.getTokenSilently();
        const baseUrl = apiUrl;
        const response = await fetch(baseUrl+"/api/user", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        //const data = {premium: false};
        const userPremium = data.premium;
        if(userPremium){
            document.querySelectorAll(".subbed").forEach(el => el.classList.remove("hidden"));
            document.querySelectorAll(".unsubbed").forEach(el => el.classList.add("hidden"));
        }else{
            document.querySelectorAll(".subbed").forEach(el => el.classList.add("hidden"));
            document.querySelectorAll(".unsubbed").forEach(el => el.classList.remove("hidden"));
        }

    } else {
        document.querySelectorAll(".logged-in").forEach(el => el.classList.add("hidden"));
        document.querySelectorAll(".logged-out").forEach(el => el.classList.remove("hidden"));
        //document.getElementById("upload-unauth").classList.remove("hidden");
        //document.getElementById("upload-container").classList.add("hidden");
        document.getElementById("gated-content").classList.add("hidden");
    }
};

// ..

export const login = async () => {
    await auth0Client.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin,
        }
    });
};

export const logout = () => {
    auth0Client.logout({
        logoutParams: {
            returnTo: window.location.origin
        }
    });
};

export const subscribe = async () => {
    console.log('subscribe');
    const isAuthenticated = await auth0Client.isAuthenticated();
    if(!isAuthenticated){
        login();
        return;
    }
    const token = await auth0Client.getTokenSilently();
    console.log(token);
    const baseUrl = apiUrl;
    const response = await fetch(baseUrl+"/api/stripe/checkout-premium", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();
    console.log(data);
    console.log('rdr');
    window.location.href = data.url;
}