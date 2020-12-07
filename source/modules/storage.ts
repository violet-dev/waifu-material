import * as fs from "fs";
import * as path from "path";

export enum StoragePreset {
	SETTINGS = "settings"
};
export type StorageState = {
	path: string,
	data: any;
};
class Storage {
	private container: (
		Record<string, StorageState>
	) = {};
	constructor(storage: Storage["container"]) {
		for (const key of Object.keys(storage)) {
			this.register(key, storage[key].path, storage[key].data);
		}
	}
	private define(object: Record<string, any>, array: string[], data: any) {
		for (const [index, value] of array.entries()) {
			if (index === array.length - 1) {
				object[value] = data;
				return;
			} else if (typeof object[value] === "undefined") {
				object[value] = {};
			}
			object = object[value];
		}
	}
	private delete(object: Record<string, any>, array: string[]) {
		for (const [index, value] of array.entries()) {
			if (index === array.length - 1) {
				delete object[value];
				return;
			} else if (typeof object[value] === "undefined") {
				return;
			}
			object = object[value];
		}
	}
	private return(object: Record<string, any>, array: string[]) {
		for (const [index, value] of array.entries()) {
			if (index === array.length - 1) {
				return object[value];
			} else if (typeof object[value] === "undefined") {
				return;
			}
			object = object[value];
		}
	}
	public get_path(key: string) {
		return this.return(this.container, [...key.split(/\./), "path"]);
	}
	public set_path(key: string, path: StorageState["path"]) {
		this.define(this.container, [...key.split(/\./), "path"], path);
		this.export(key);
	}
	public get_data(key: string) {
		return this.return(this.container, [...key.split(/\./), "data"]);
	}
	public set_data(key: string, data: StorageState["data"]) {
		this.define(this.container, [...key.split(/\./), "data"], data);
		this.export(key);
	}
	public register(key: string, path: StorageState["path"], data: StorageState["data"]) {
		this.define(this.container, [...key.split(/\./)], {
			path: path,
			data: data === "@import" ? this.import(path) : {}
		});
		this.export(key);
	}
	public un_register(key: string) {
		fs.unlinkSync(this.get_path(key));
		this.delete(this.container, [...key.split(/\./)]);
	}
	public import(key: string): any {
		try {
			return JSON.parse(fs.readFileSync(this.get_path(key) || key, "utf8"));
		} catch {
			return {};
		}
	}
	public export(key: string) {
		fs.mkdirSync(path.dirname(this.get_path(key)), { recursive: true });
		fs.writeFileSync(this.get_path(key), JSON.stringify(this.get_data(key)));
	}
	public exist(key: string) {
		return !!this.return(this.container, [...key.split(/\./)]);
	}
}
export default (new Storage({
	[StoragePreset.SETTINGS]: {
		path: "./settings.json",
		data: "@import"
	}
}));
