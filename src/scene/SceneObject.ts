import { Serializable } from 'basepower';

export abstract class SceneObject extends Serializable {

	private _name: string;
	private _x: number;
	private _y: number;
	private _width: number;
	private _height: number;
	private _rotation: number;
	private _color: string;
	private _visible: boolean;

	constructor( name: string ) {

		super();

		this._name = name;
		this._x = 0;
		this._y = 0;
		this._width = 100;
		this._height = 100;
		this._rotation = 0;
		this._color = '#ffffff';
		this._visible = true;

		this.field( 'name', () => this._name, ( v ) => { this._name = v; } );

		const transformDir = this.fieldDir( 'transform' );
		transformDir.field( 'x', () => this._x, ( v ) => { this._x = v; }, { step: 1 } );
		transformDir.field( 'y', () => this._y, ( v ) => { this._y = v; }, { step: 1 } );
		transformDir.field( 'width', () => this._width, ( v ) => { this._width = v; }, { step: 1 } );
		transformDir.field( 'height', () => this._height, ( v ) => { this._height = v; }, { step: 1 } );
		transformDir.field( 'rotation', () => this._rotation, ( v ) => { this._rotation = v; }, { step: 1 } );

		const styleDir = this.fieldDir( 'style' );
		styleDir.field( 'color', () => this._color, ( v ) => { this._color = v; } );
		styleDir.field( 'visible', () => this._visible, ( v ) => { this._visible = v; } );

	}

	get name() { return this._name; }
	get x() { return this._x; }
	get y() { return this._y; }
	get width() { return this._width; }
	get height() { return this._height; }
	get rotation() { return this._rotation; }
	get color() { return this._color; }
	get visible() { return this._visible; }

	abstract render( ctx: CanvasRenderingContext2D ): void;

	abstract containsPoint( px: number, py: number ): boolean;

}
