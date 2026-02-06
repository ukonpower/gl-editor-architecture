import { useRef, useEffect, useCallback } from 'react';

import { useEditor } from '../../EditorContext';
import { Renderer } from '../../../scene/Renderer';
import { frozenObjects } from '../../../demo/animationControl';
import type { SceneObject } from '../../../scene/SceneObject';
import styles from './CanvasViewport.module.css';

const DRAG_THRESHOLD = 3;

interface DragState {
	isDragging: boolean;
	object: SceneObject | null;
	offsetX: number;
	offsetY: number;
	startCanvasX: number;
	startCanvasY: number;
	hasMoved: boolean;
}

export function ViewportPanel() {

	const { scene, selectObject } = useEditor();
	const canvasRef = useRef<HTMLCanvasElement>( null );
	const rendererRef = useRef<Renderer | null>( null );
	const dragRef = useRef<DragState>( {
		isDragging: false,
		object: null,
		offsetX: 0,
		offsetY: 0,
		startCanvasX: 0,
		startCanvasY: 0,
		hasMoved: false,
	} );

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

	const hitTest = useCallback( ( x: number, y: number ): SceneObject | null => {

		for ( let i = scene.objects.length - 1; i >= 0; i -- ) {

			const obj = scene.objects[ i ];

			if ( obj.visible && obj.containsPoint( x, y ) ) {

				return obj;

			}

		}

		return null;

	}, [ scene ] );

	const handleMouseDown = useCallback( ( e: React.MouseEvent<HTMLCanvasElement> ) => {

		const renderer = rendererRef.current;

		if ( ! renderer ) return;

		const { x, y } = renderer.getCanvasPoint( e.clientX, e.clientY );
		const obj = hitTest( x, y );

		if ( obj ) {

			selectObject( obj );

			dragRef.current = {
				isDragging: true,
				object: obj,
				offsetX: x - obj.x,
				offsetY: y - obj.y,
				startCanvasX: x,
				startCanvasY: y,
				hasMoved: false,
			};

			frozenObjects.add( obj.uuid );

		} else {

			selectObject( null );

		}

	}, [ scene, selectObject, hitTest ] );

	const handleMouseMove = useCallback( ( e: React.MouseEvent<HTMLCanvasElement> ) => {

		const drag = dragRef.current;

		if ( ! drag.isDragging || ! drag.object ) return;

		const renderer = rendererRef.current;

		if ( ! renderer ) return;

		const { x, y } = renderer.getCanvasPoint( e.clientX, e.clientY );

		if ( ! drag.hasMoved ) {

			const dx = x - drag.startCanvasX;
			const dy = y - drag.startCanvasY;

			if ( Math.sqrt( dx * dx + dy * dy ) < DRAG_THRESHOLD ) return;

			drag.hasMoved = true;

		}

		drag.object.setField( 'transform/x', Math.round( x - drag.offsetX ) );
		drag.object.setField( 'transform/y', Math.round( y - drag.offsetY ) );

	}, [] );

	const endDrag = useCallback( () => {

		const drag = dragRef.current;

		if ( drag.isDragging && drag.object ) {

			frozenObjects.delete( drag.object.uuid );

		}

		dragRef.current = {
			isDragging: false,
			object: null,
			offsetX: 0,
			offsetY: 0,
			startCanvasX: 0,
			startCanvasY: 0,
			hasMoved: false,
		};

	}, [] );

	return (
		<div className={ styles.viewport }>
			<canvas
				ref={ canvasRef }
				className={ styles.canvas }
				onMouseDown={ handleMouseDown }
				onMouseMove={ handleMouseMove }
				onMouseUp={ endDrag }
				onMouseLeave={ endDrag }
			/>
		</div>
	);

}
