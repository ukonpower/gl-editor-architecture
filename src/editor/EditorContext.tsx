import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

import type { Scene } from '../scene/Scene';
import type { SceneObject } from '../scene/SceneObject';
import { useSerializableField } from 'basepower/react';

interface EditorContextValue {
	scene: Scene;
	selectedObject: SceneObject | null;
	selectObject: ( obj: SceneObject | null ) => void;
	objects: SceneObject[];
}

const EditorCtx = createContext<EditorContextValue | null>( null );

export function EditorProvider( { scene, children }: { scene: Scene, children: ReactNode } ) {

	const [ objects, setObjects ] = useState<SceneObject[]>( () => [ ...scene.objects ] );
	const [ selectedId ] = useSerializableField<string>( scene, 'selectedObjectId' );

	useEffect( () => {

		const onAdded = () => setObjects( [ ...scene.objects ] );
		const onRemoved = () => setObjects( [ ...scene.objects ] );

		scene.on( 'object/added', onAdded );
		scene.on( 'object/removed', onRemoved );

		return () => {

			scene.off( 'object/added', onAdded );
			scene.off( 'object/removed', onRemoved );

		};

	}, [ scene ] );

	const selectedObject = objects.find( o => o.uuid === selectedId ) ?? null;

	const selectObject = ( obj: SceneObject | null ) => {

		scene.selectObject( obj );

	};

	return (
		<EditorCtx.Provider value={ { scene, selectedObject, selectObject, objects } }>
			{ children }
		</EditorCtx.Provider>
	);

}

export function useEditor() {

	const ctx = useContext( EditorCtx );

	if ( ! ctx ) throw new Error( 'useEditor must be used within EditorProvider' );

	return ctx;

}
