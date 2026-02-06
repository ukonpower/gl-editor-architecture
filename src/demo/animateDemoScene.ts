import type { Scene } from '../scene/Scene';
import { frozenObjects } from './animationControl';

export function animateDemoScene( scene: Scene ): () => void {

	const target = scene.objects.find( o => o.name === 'Yellow Circle' );

	if ( ! target ) return () => {};

	const centerX = 400;
	const centerY = 200;
	const radius = 130;
	const speed = 0.03; // radians per tick

	let angle = Math.atan2(
		target.y - centerY,
		target.x - centerX,
	);

	const id = setInterval( () => {

		if ( frozenObjects.has( target.uuid ) ) {

			// ドラッグ中 — 現在位置からangleを再計算し、リリース後にその位置から再開
			angle = Math.atan2(
				target.y - centerY,
				target.x - centerX,
			);
			return;

		}

		angle += speed;

		const x = Math.round( centerX + Math.cos( angle ) * radius );
		const y = Math.round( centerY + Math.sin( angle ) * radius );
		const rotation = Math.round( ( angle * 180 / Math.PI ) % 360 );

		target.setField( 'transform/x', x );
		target.setField( 'transform/y', y );
		target.setField( 'transform/rotation', rotation );

	}, 33 );

	return () => clearInterval( id );

}
