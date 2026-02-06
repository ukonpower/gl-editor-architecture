import type { Serializable, FieldOpt } from 'basepower';
import { useSerializableField } from 'basepower/react';
import styles from './FieldRow.module.css';

export function NumberField( {
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

	const [ value, setValue ] = useSerializableField<number>( serializable, path );

	return (
		<div className={ styles.row }>
			<span className={ styles.label }>{ opt?.label ?? label }</span>
			<input
				className={ styles.input }
				type="number"
				value={ value ?? 0 }
				step={ opt?.step ?? 1 }
				disabled={ opt?.readOnly }
				onChange={ ( e ) => setValue( parseFloat( e.target.value ) || 0 ) }
			/>
		</div>
	);

}
