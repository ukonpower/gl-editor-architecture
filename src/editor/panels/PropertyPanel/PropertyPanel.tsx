import { useEditor } from '../../EditorContext';
import { SerializableFieldView } from './SerializableFieldView';
import styles from './PropertyPanel.module.css';

export function PropertyPanel() {

	const { selectedObject } = useEditor();

	return (
		<div className={ styles.panel }>
			<div className={ styles.header }>Properties</div>
			{ selectedObject ? (
				<div className={ styles.content }>
					<SerializableFieldView serializable={ selectedObject } />
				</div>
			) : (
				<div className={ styles.empty }>No object selected</div>
			) }
		</div>
	);

}
