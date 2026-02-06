import { SceneObject } from '../SceneObject';

export class Circle extends SceneObject {

	constructor( name: string = 'Circle' ) {

		super( name );

	}

	render( ctx: CanvasRenderingContext2D ) {

		if ( ! this.visible ) return;

		const radius = Math.min( this.width, this.height ) / 2;

		ctx.save();
		ctx.translate( this.x + this.width / 2, this.y + this.height / 2 );
		ctx.rotate( this.rotation * Math.PI / 180 );
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc( 0, 0, radius, 0, Math.PI * 2 );
		ctx.fill();
		ctx.restore();

	}

	containsPoint( px: number, py: number ): boolean {

		const cx = this.x + this.width / 2;
		const cy = this.y + this.height / 2;
		const radius = Math.min( this.width, this.height ) / 2;
		const dx = px - cx;
		const dy = py - cy;

		return dx * dx + dy * dy <= radius * radius;

	}

}
