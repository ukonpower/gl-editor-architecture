import { useEditor } from '../../EditorContext';
import { useWatchSerializable } from 'basepower/react';
import type { SceneObject } from '../../../scene/SceneObject';
import styles from './HierarchyPanel.module.css';

function HierarchyItem( { obj }: { obj: SceneObject } ) {

	const { selectedObject, selectObject } = useEditor();
	const fields = useWatchSerializable( obj, [ 'name', 'style/visible' ] );
	const isSelected = selectedObject?.uuid === obj.uuid;
	const name = fields?.[ 'name' ] as string ?? 'Unnamed';
	const visible = fields?.[ 'style/visible' ] as boolean ?? true;

	return (
		<div
			className={ `${ styles.item } ${ isSelected ? styles.selected : '' }` }
			onClick={ () => selectObject( obj ) }
		>
			<span className={ `${ styles.visibility } ${ ! visible ? styles.hidden : '' }` }>
				{ visible ? '\u25C9' : '\u25CE' }
			</span>
			<span className={ styles.name }>{ name }</span>
		</div>
	);

}

export function HierarchyPanel() {

	const { objects } = useEditor();

	return (
		<div className={ styles.panel }>
			<div className={ styles.header }>Hierarchy</div>
			<div className={ styles.list }>
				{ objects.map( obj => (
					<HierarchyItem key={ obj.uuid } obj={ obj } />
				) ) }
			</div>
		</div>
	);

}
