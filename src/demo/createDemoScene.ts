import { Scene } from '../scene/Scene';
import { Rectangle } from '../scene/objects/Rectangle';
import { Circle } from '../scene/objects/Circle';

export function createDemoScene(): Scene {

	const scene = new Scene();

	const blueRect = new Rectangle( 'Blue Box' );
	blueRect.setField( 'transform/x', 80 );
	blueRect.setField( 'transform/y', 60 );
	blueRect.setField( 'transform/width', 150 );
	blueRect.setField( 'transform/height', 100 );
	blueRect.setField( 'style/color', '#4a7fff' );
	scene.addObject( blueRect );

	const redCircle = new Circle( 'Red Circle' );
	redCircle.setField( 'transform/x', 300 );
	redCircle.setField( 'transform/y', 120 );
	redCircle.setField( 'transform/width', 120 );
	redCircle.setField( 'transform/height', 120 );
	redCircle.setField( 'style/color', '#ff4a4a' );
	scene.addObject( redCircle );

	const greenRect = new Rectangle( 'Green Box' );
	greenRect.setField( 'transform/x', 150 );
	greenRect.setField( 'transform/y', 250 );
	greenRect.setField( 'transform/width', 180 );
	greenRect.setField( 'transform/height', 80 );
	greenRect.setField( 'style/color', '#4aff7f' );
	scene.addObject( greenRect );

	const yellowCircle = new Circle( 'Yellow Circle' );
	yellowCircle.setField( 'transform/x', 450 );
	yellowCircle.setField( 'transform/y', 50 );
	yellowCircle.setField( 'transform/width', 100 );
	yellowCircle.setField( 'transform/height', 100 );
	yellowCircle.setField( 'style/color', '#ffdd4a' );
	scene.addObject( yellowCircle );

	return scene;

}
