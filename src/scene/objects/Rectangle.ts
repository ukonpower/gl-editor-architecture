import { SceneObject } from '../SceneObject';

export class Rectangle extends SceneObject {

	constructor( name: string = 'Rectangle' ) {

		super( name );

	}

	render( ctx: CanvasRenderingContext2D ) {

		if ( ! this.visible ) return;

		ctx.save();
		ctx.translate( this.x + this.width / 2, this.y + this.height / 2 );
		ctx.rotate( this.rotation * Math.PI / 180 );
		ctx.fillStyle = this.color;
		ctx.fillRect( - this.width / 2, - this.height / 2, this.width, this.height );
		ctx.restore();

	}

	containsPoint( px: number, py: number ): boolean {

		const cos = Math.cos( - this.rotation * Math.PI / 180 );
		const sin = Math.sin( - this.rotation * Math.PI / 180 );
		const cx = this.x + this.width / 2;
		const cy = this.y + this.height / 2;
		const dx = px - cx;
		const dy = py - cy;
		const lx = dx * cos - dy * sin;
		const ly = dx * sin + dy * cos;

		return Math.abs( lx ) <= this.width / 2 && Math.abs( ly ) <= this.height / 2;

	}

}
