import { ShortcutRecord } from 'common/shortcuts';
import { ipcRenderer, OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import { unproxify } from '../libs/unproxify';

export default class {
   static getKey () {
      return ipcRenderer.sendSync('get-key');
   }

   static showOpenDialog (options: OpenDialogOptions): Promise<OpenDialogReturnValue> {
      return ipcRenderer.invoke('show-open-dialog', unproxify(options));
   }

   static getDownloadPathDirectory (): Promise<string> {
      return ipcRenderer.invoke('get-download-dir-path');
   }

   static reloadShortcuts () {
      return ipcRenderer.invoke('reload-shortcuts');
   }

   static updateShortcuts (shortcuts: ShortcutRecord[]) {
      return ipcRenderer.invoke('update-shortcuts', unproxify(shortcuts));
   }

   static restoreDefaultShortcuts () {
      return ipcRenderer.invoke('resotre-default-shortcuts');
   }

   static unregisterShortcuts () {
      return ipcRenderer.invoke('unregister-shortcuts');
   }
}
