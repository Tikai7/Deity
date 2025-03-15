
export const CLIENT_COUNT = "CLIENT_COUNT"
export const CAKE = "CAKE"
export const waitingTime = 2000
export const waitingTimeValidate = 100

export function generateUID(tag) {
    const now = new Date().getTime()
    return `${tag}_${now}${Math.random().toString(16).substr(2)}`
}

export function convertDate(isoString){
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate
}