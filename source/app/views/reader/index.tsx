import * as React from "react";

import "./index.scss";

import Media from "@/app/components/media";

import utility from "@/modules/utility";

export type ReaderState = {
	disable: boolean;
};

class Reader extends React.Component<ReaderState> {
	public state: ReaderState;
	constructor(properties: ReaderState) {
		super(properties);
		this.state = { ...properties };
	}
	static getDerivedStateFromProps($new: ReaderState, $old: ReaderState) {
		return $new;
	}
	public render() {
		return (
			<section id="reader" class={utility.inline({ "disable": this.state.disable, "right": true })}>
				<Media></Media>
			</section>
		);
	}
}
export default Reader;