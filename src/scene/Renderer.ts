import type { Scene } from './Scene';
import type { SceneObject } from './SceneObject';

export class Renderer {

	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	constructor( canvas: HTMLCanvasElement ) {

		this.canvas = canvas;
		this.ctx = canvas.getContext( '2d' )!;

	}

	render( scene: Scene ) {

		const { canvas, ctx } = this;
		const dpr = window.devicePixelRatio || 1;

		canvas.width = canvas.clientWidth * dpr;
		canvas.height = canvas.clientHeight * dpr;

		ctx.setTransform( dpr, 0, 0, dpr, 0, 0 );
		ctx.clearRect( 0, 0, canvas.clientWidth, canvas.clientHeight );

		// draw grid
		this.drawGrid();

		// draw objects
		for ( const obj of scene.objects ) {

			obj.render( ctx );

		}

		// draw selection
		const selected = scene.selectedObject;

		if ( selected && selected.visible ) {

			this.drawSelection( selected );

		}

	}

	private drawGrid() {

		const { ctx, canvas } = this;
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		const step = 50;

		ctx.strokeStyle = '#2a2a2a';
		ctx.lineWidth = 1;

		for ( let x = 0; x <= w; x += step ) {

			ctx.beginPath();
			ctx.moveTo( x, 0 );
			ctx.lineTo( x, h );
			ctx.stroke();

		}

		for ( let y = 0; y <= h; y += step ) {

			ctx.beginPath();
			ctx.moveTo( 0, y );
			ctx.lineTo( w, y );
			ctx.stroke();

		}

	}

	private drawSelection( obj: SceneObject ) {

		const { ctx } = this;

		ctx.save();
		ctx.translate( obj.x + obj.width / 2, obj.y + obj.height / 2 );
		ctx.rotate( obj.rotation * Math.PI / 180 );
		ctx.strokeStyle = '#4a9eff';
		ctx.lineWidth = 2;
		ctx.setLineDash( [ 6, 4 ] );
		ctx.strokeRect( - obj.width / 2 - 4, - obj.height / 2 - 4, obj.width + 8, obj.height + 8 );
		ctx.restore();

	}

	getCanvasPoint( clientX: number, clientY: number ): { x: number, y: number } {

		const rect = this.canvas.getBoundingClientRect();

		return {
			x: clientX - rect.left,
			y: clientY - rect.top,
		};

	}

}
