export const checkResError = async (response) => {
    if (!response.ok) {
        let err;
        try {
            err = await response.clone().json()
        } catch (e) {
            err = await response.clone().text();
        }
        handleResError(err);
        throw new Error(err);
    }
}
export const handleResError = (errObject) => {
    let msg = errObject?.error?.message || errObject?.message;
    if (typeof errObject === 'string') {
        msg = errObject;
    }
    alert(msg || 'Error');
    console.error('Res error:');
    console.error(errObject);
}