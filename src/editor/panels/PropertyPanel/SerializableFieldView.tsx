import { useState } from 'react';

import type { Serializable, SchemaNode, SchemaGroup, SchemaField } from 'basepower';
import { useWatchSerializable } from 'basepower/react';
import { NumberField } from './fields/NumberField';
import { StringField } from './fields/StringField';
import { BooleanField } from './fields/BooleanField';
import { ColorField } from './fields/ColorField';
import styles from './SerializableFieldView.module.css';

function FieldGroup( { label, children }: { label: string, children: React.ReactNode } ) {

	const [ open, setOpen ] = useState( true );

	return (
		<div className={ styles.group }>
			<div className={ styles.groupHeader } onClick={ () => setOpen( ! open ) }>
				<span className={ styles.arrow }>{ open ? '\u25BE' : '\u25B8' }</span>
				{ label }
			</div>
			{ open && <div className={ styles.groupContent }>{ children }</div> }
		</div>
	);

}

function FieldNode( {
	serializable,
	node,
	path,
	label,
}: {
	serializable: Serializable,
	node: SchemaNode,
	path: string,
	label: string,
} ) {

	if ( node.type === 'group' ) {

		const group = node as SchemaGroup;

		return (
			<FieldGroup label={ label }>
				{ Object.entries( group.childs ).map( ( [ key, child ] ) => (
					<FieldNode
						key={ key }
						serializable={ serializable }
						node={ child }
						path={ path ? `${ path }/${ key }` : key }
						label={ key }
					/>
				) ) }
			</FieldGroup>
		);

	}

	const field = node as SchemaField;
	const value = field.value;
	const opt = field.opt;

	if ( opt?.hidden === true ) return null;

	if ( typeof opt?.hidden === 'function' && opt.hidden( value ) ) return null;

	if ( typeof value === 'number' ) {

		return <NumberField serializable={ serializable } path={ path } label={ label } opt={ opt } />;

	}

	if ( typeof value === 'string' ) {

		if ( path.includes( 'color' ) || ( value.startsWith( '#' ) && ( value.length === 7 || value.length === 4 ) ) ) {

			return <ColorField serializable={ serializable } path={ path } label={ label } opt={ opt } />;

		}

		return <StringField serializable={ serializable } path={ path } label={ label } opt={ opt } />;

	}

	if ( typeof value === 'boolean' ) {

		return <BooleanField serializable={ serializable } path={ path } label={ label } opt={ opt } />;

	}

	return null;

}

export function SerializableFieldView( { serializable }: { serializable: Serializable } ) {

	// subscribe to all field updates to rebuild schema
	useWatchSerializable( serializable );

	const schema = serializable.getSchema();

	if ( schema.type !== 'group' ) return null;

	return (
		<div className={ styles.root }>
			{ Object.entries( schema.childs ).map( ( [ key, node ] ) => (
				<FieldNode
					key={ key }
					serializable={ serializable }
					node={ node }
					path={ key }
					label={ key }
				/>
			) ) }
		</div>
	);

}
