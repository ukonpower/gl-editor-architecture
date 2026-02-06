import type { Serializable, FieldOpt } from 'basepower';
import { useSerializableField } from 'basepower/react';
import styles from './FieldRow.module.css';

export function BooleanField( {
	serializable,
	path,
	label,
	opt,
}: {
	serializable: Serializable,
	path: string,
	label: string,
	opt?: FieldOpt,
} ) {

	const [ value, setValue ] = useSerializableField<boolean>( serializable, path );

	return (
		<div className={ styles.row }>
			<span className={ styles.label }>{ opt?.label ?? label }</span>
			<input
				className={ styles.checkbox }
				type="checkbox"
				checked={ value ?? false }
				disabled={ opt?.readOnly }
				onChange={ ( e ) => setValue( e.target.checked ) }
			/>
		</div>
	);

}
