import styles from './EditorApp.module.css';
import { EditorProvider } from './EditorContext';
import { HierarchyPanel } from './panels/HierarchyPanel/HierarchyPanel';
import { ViewportPanel } from './panels/ViewportPanel/CanvasViewport';
import { PropertyPanel } from './panels/PropertyPanel/PropertyPanel';
import type { Scene } from '../scene/Scene';

export function EditorApp( { scene }: { scene: Scene } ) {

	return (
		<EditorProvider scene={ scene }>
			<div className={ styles.editor }>
				<div className={ styles.hierarchy }>
					<HierarchyPanel />
				</div>
				<div className={ styles.viewport }>
					<ViewportPanel />
				</div>
				<div className={ styles.properties }>
					<PropertyPanel />
				</div>
			</div>
		</EditorProvider>
	);

}
