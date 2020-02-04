declare interface Clipboard {
  write(data: ClipboardItem[]): Promise<void>
  read(): Promise<Array<ClipboardItem>>
}
declare class ClipboardItem {
  constructor(data: { [mimeType: string]: Blob })
  types: Array<string>
  getType(type: string): Promise<Blob>
}

declare type ExtendedPermissionName = PermissionName | 'clipboard-write'
