import type { Serializable, FieldOpt } from 'basepower';
import { useSerializableField } from 'basepower/react';
import styles from './FieldRow.module.css';

export function StringField( {
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

	const [ value, setValue ] = useSerializableField<string>( serializable, path );

	return (
		<div className={ styles.row }>
			<span className={ styles.label }>{ opt?.label ?? label }</span>
			<input
				className={ styles.input }
				type="text"
				value={ value ?? '' }
				disabled={ opt?.readOnly }
				onChange={ ( e ) => setValue( e.target.value ) }
			/>
		</div>
	);

}
