export const getNullableJson = async (response) => {
    try {
        return await response.json();
    }
    catch (e) {
        return null;
    }
}
export const checkResError = async (response, doAlert = true) => {
    if (!response.ok) {
        let err;
        try {
            err = await response.clone().json()
        } catch (e) {
            err = await response.clone().text();
        }
        handleResError(err, doAlert);
        throw new Error(err);
    }
}
export const handleResError = (errObject, doAlert) => {
    let msg = errObject?.error?.message || errObject?.message;
    if (typeof errObject === 'string') {
        msg = errObject;
    }
    doAlert && alert(msg || 'Error');
    console.error('Res error:');
    console.error(errObject);
}