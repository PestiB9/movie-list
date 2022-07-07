import {setGenericPassword, getGenericPassword} from 'react-native-keychain';

export function writeDisk(data: any) {
  setGenericPassword('movieList', JSON.stringify(data));
}

export async function readDisk() {
  try {
    const diskData = await getGenericPassword();
    return JSON.parse(diskData.password);
  } catch (error) {
    return {hiddenList: [], favouriteList: []};
  }
}
