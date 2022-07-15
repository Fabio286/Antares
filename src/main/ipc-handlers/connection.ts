import * as antares from 'common/interfaces/antares';
import * as fs from 'fs';
import { ipcMain } from 'electron';
import { ClientsFactory } from '../libs/ClientsFactory';
import { SslOptions } from 'mysql2';

export default (connections: {[key: string]: antares.Client}) => {
   ipcMain.handle('test-connection', async (event, conn: antares.ConnectionParams) => {
      const params = {
         host: conn.host,
         port: +conn.port,
         user: conn.user,
         password: conn.password,
         readonly: conn.readonly,
         database: '',
         schema: '',
         databasePath: '',
         ssl: undefined as SslOptions,
         ssh: undefined as {
            host: string;
            username: string;
            password: string;
            port: number;
            privateKey: string;
            passphrase: string;
         }
      };

      if (conn.database)
         params.database = conn.database;

      if (conn.databasePath)
         params.databasePath = conn.databasePath;

      if (conn.ssl) {
         params.ssl = {
            key: conn.key ? fs.readFileSync(conn.key).toString() : null,
            cert: conn.cert ? fs.readFileSync(conn.cert).toString() : null,
            ca: conn.ca ? fs.readFileSync(conn.ca).toString() : null,
            ciphers: conn.ciphers,
            rejectUnauthorized: !conn.untrustedConnection
         };
      }

      if (conn.ssh) {
         params.ssh = {
            host: conn.sshHost,
            username: conn.sshUser,
            password: conn.sshPass,
            port: conn.sshPort ? conn.sshPort : 22,
            privateKey: conn.sshKey ? fs.readFileSync(conn.sshKey).toString() : null,
            passphrase: conn.sshPassphrase
         };
      }

      try {
         const connection = await ClientsFactory.getClient({
            uid: conn.uid,
            client: conn.client,
            params
         });
         await connection.connect();

         await connection.select('1+1').run();
         connection.destroy();

         return { status: 'success' };
      }
      catch (err) {
         return { status: 'error', response: err.toString() };
      }
   });

   ipcMain.handle('check-connection', async (event, uid) => {
      return uid in connections;
   });

   ipcMain.handle('connect', async (event, conn: antares.ConnectionParams) => {
      const params = {
         host: conn.host,
         port: +conn.port,
         user: conn.user,
         password: conn.password,
         application_name: 'Antares SQL',
         readonly: conn.readonly,
         database: '',
         schema: '',
         databasePath: '',
         ssl: undefined as SslOptions,
         ssh: undefined as {
            host: string;
            username: string;
            password: string;
            port: number;
            privateKey: string;
            passphrase: string;
         }
      };

      if (conn.database)
         params.database = conn.database;

      if (conn.databasePath)
         params.databasePath = conn.databasePath;

      if (conn.schema)
         params.schema = conn.schema;

      if (conn.ssl) {
         params.ssl = {
            key: conn.key ? fs.readFileSync(conn.key).toString() : null,
            cert: conn.cert ? fs.readFileSync(conn.cert).toString() : null,
            ca: conn.ca ? fs.readFileSync(conn.ca).toString() : null,
            ciphers: conn.ciphers,
            rejectUnauthorized: !conn.untrustedConnection
         };
      }

      if (conn.ssh) {
         params.ssh = {
            host: conn.sshHost,
            username: conn.sshUser,
            password: conn.sshPass,
            port: conn.sshPort ? conn.sshPort : 22,
            privateKey: conn.sshKey ? fs.readFileSync(conn.sshKey).toString() : null,
            passphrase: conn.sshPassphrase
         };
      }

      try {
         const connection = ClientsFactory.getClient({
            uid: conn.uid,
            client: conn.client,
            params,
            poolSize: 5
         });

         await connection.connect();

         const structure = await connection.getStructure(new Set());

         connections[conn.uid] = connection;

         return { status: 'success', response: structure };
      }
      catch (err) {
         return { status: 'error', response: err.toString() };
      }
   });

   ipcMain.handle('disconnect', (event, uid) => {
      connections[uid].destroy();
      delete connections[uid];
   });
};
