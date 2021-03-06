import * as React from "react";

import "./index.scss";

import Gallery from "@/app/components/gallery";

import utility from "@/modules/utility";
import worker from "@/statics/worker";

import { CommonProps } from "@/common";
import { StaticEvent } from "@/statics";
import { GalleryBlock } from "@/modules/hitomi/read";
import { Task, TaskStatus } from "@/modules/download";

export type GalleryListProps = CommonProps & {
	options: {
		blocks: GalleryBlock[];
	},
	handler?: Record<"click", (button: number, key: string, value: string) => void>;
};
export type GalleryListState = {
	[key: number]: {
		status: TaskStatus;
	};
};

class GalleryList extends React.Component<GalleryListProps, GalleryListState> {
	public props: GalleryListProps;
	public state: GalleryListState;
	constructor(props: GalleryListProps) {
		super(props);
		this.props = props;
		this.state = Object.assign({}, ...Object.values(worker.get()).map((task) => { return { [task.id]: { status: task.status } }; }));

		window.static.on(StaticEvent.WORKER, (args) => {
			const [$index, $new] = args as [number, Task | undefined, Task | undefined];

			switch ($new ? $new.status : TaskStatus.NONE) {
				case this.state[$index]?.status: {
					break;
				}
				default: {
					this.setState({ ...this.state, [$index]: { ...this.state[$index], status: $new ? $new.status : TaskStatus.NONE } });
					break;
				}
			}
		});
	}
	static getDerivedStateFromProps($new: GalleryListProps, $old: GalleryListProps) {
		return $new;
	}
	public render() {
		return (
			<section data-component="gallery.list" id={this.props.id} class={utility.inline({ ...this.props.class })}>
				{this.props.options.blocks.map((gallery, index) => {
					return (
						<Gallery options={{ gallery: gallery, status: this.state[gallery.id] ? this.state[gallery.id].status : TaskStatus.NONE }} key={index}
							handler={{
								click: (button, key, value) => {
									this.props.handler?.click(button, key, value);
								}
							}}
						></Gallery>
					);
				})}
			</section>
		);
	}
}
export default GalleryList;
