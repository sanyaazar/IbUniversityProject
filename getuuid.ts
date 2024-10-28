import { exec } from 'child_process';

export function getWmicUUID(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec('wmic csproduct get UUID', (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
        return;
      }

      const uuid = stdout.split('\n')[1].trim();
      resolve(uuid);
    });
  });
}
