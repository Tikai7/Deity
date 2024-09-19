import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to retrieve data from local storage
export const getMyData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // Error retrieving data
        console.error('Error retrieving data from AsyncStorage:', e);
        return null;
    }
};

// Function to store data locally
export const storeMyData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        return true;
    } catch (e) {
        // Error storing data
        console.error('Error storing data in AsyncStorage:', e);
        return false;
    }
};

export const deleteItem = async(itemKey) => {
    try {
        await AsyncStorage.removeItem(itemKey)
        console.log('Item deleted from AsyncStorage:', itemKey);
        return true;
    } catch (error) {
        console.error('Error clearing all items from AsyncStorage:', e);
        return false;
    }

}

export const clearAll = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
        return true;
    } catch (e) {
        console.error('Error clearing all items from AsyncStorage:', e);
        return false;
    }
};


export const convertDateToString = (date) => {
    // Convert date to string and add a 0 if needed
    avoidData = ["8","9"]
    if (!(date instanceof Date)) 
        date = new Date(date)
    stringDate = date.getHours() + "h" + date.getMinutes()

    while (stringDate.length < 5 && avoidData.includes(stringDate[0])) 
        stringDate = "0"+stringDate
    if (stringDate.length < 5)
        stringDate = stringDate + "0"

    return stringDate
}

