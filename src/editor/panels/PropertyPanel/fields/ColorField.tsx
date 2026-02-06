import type { Serializable, FieldOpt } from 'basepower';
import { useSerializableField } from 'basepower/react';
import styles from './FieldRow.module.css';

export function ColorField( {
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
			<div className={ styles.colorWrapper }>
				<input
					className={ styles.colorInput }
					type="color"
					value={ value ?? '#ffffff' }
					disabled={ opt?.readOnly }
					onChange={ ( e ) => setValue( e.target.value ) }
				/>
				<input
					className={ `${ styles.input } ${ styles.colorText }` }
					type="text"
					value={ value ?? '#ffffff' }
					disabled={ opt?.readOnly }
					onChange={ ( e ) => setValue( e.target.value ) }
				/>
			</div>
		</div>
	);

}
