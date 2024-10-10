export type Note = {
  secret: string,
  nullifierPreimage: string,
  commitment: string,
  commitmentindex: number,
  isL1: boolean
}

export function isNote(obj: any): obj is Note {
    return typeof obj === 'object' &&
       typeof obj.secret === 'string' &&
       typeof obj.commitment === 'string' &&
       typeof obj.commitmentindex === 'number' &&
       typeof obj.isL1 === 'boolean';
  }