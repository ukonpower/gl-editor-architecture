import { useRef, useEffect, useCallback } from 'react';

import { useEditor } from '../../EditorContext';
import { Renderer } from '../../../scene/Renderer';
import styles from './CanvasViewport.module.css';

export function ViewportPanel() {

	const { scene, selectObject } = useEditor();
	const canvasRef = useRef<HTMLCanvasElement>( null );
	const rendererRef = useRef<Renderer | null>( null );

	useEffect( () => {

		const canvas = canvasRef.current;

		if ( ! canvas ) return;

		rendererRef.current = new Renderer( canvas );

		let animId: number;

		const loop = () => {

			rendererRef.current!.render( scene );
			animId = requestAnimationFrame( loop );

		};

		animId = requestAnimationFrame( loop );

		return () => {

			cancelAnimationFrame( animId );

		};

	}, [ scene ] );

	const handleClick = useCallback( ( e: React.MouseEvent<HTMLCanvasElement> ) => {

		const renderer = rendererRef.current;

		if ( ! renderer ) return;

		const { x, y } = renderer.getCanvasPoint( e.clientX, e.clientY );

		// reverse iterate so topmost object is selected first
		for ( let i = scene.objects.length - 1; i >= 0; i -- ) {

			const obj = scene.objects[ i ];

			if ( obj.visible && obj.containsPoint( x, y ) ) {

				selectObject( obj );
				return;

			}

		}

		selectObject( null );

	}, [ scene, selectObject ] );

	return (
		<div className={ styles.viewport }>
			<canvas
				ref={ canvasRef }
				className={ styles.canvas }
				onClick={ handleClick }
			/>
		</div>
	);

}
