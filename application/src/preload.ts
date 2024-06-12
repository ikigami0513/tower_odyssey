import { contextBridge, crashReporter, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    close: () => ipcRenderer.send('close-app'),
    setUserId: (userId: string) => {
        crashReporter.addExtraParameter('userId', userId);
    },
    screenshot: () => ipcRenderer.send('capture-screen')
});