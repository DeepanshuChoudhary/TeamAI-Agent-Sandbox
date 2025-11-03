import { WebContainer } from '@webcontainer/api';

let webContainerInstance = null;
// let webContainerInstance;

export const getWebContainer = async () => {
    if(!webContainerInstance) {
        webContainerInstance = await WebContainer.boot();
    }
    return webContainerInstance;
}