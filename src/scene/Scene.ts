import { Serializable } from 'basepower';

import type { SceneObject } from './SceneObject';

export class Scene extends Serializable {

	private _objects: SceneObject[] = [];
	private _selectedObjectId: string = '';

	constructor() {

		super();

		this.field( 'selectedObjectId',
			() => this._selectedObjectId,
			( v ) => { this._selectedObjectId = v; }
		);

	}

	get objects() { return this._objects; }

	get selectedObject(): SceneObject | null {

		return this._objects.find( o => o.uuid === this._selectedObjectId ) ?? null;

	}

	addObject( obj: SceneObject ) {

		this._objects.push( obj );
		this.emit( 'object/added', [ obj ] );

	}

	removeObject( obj: SceneObject ) {

		const idx = this._objects.indexOf( obj );

		if ( idx !== - 1 ) {

			this._objects.splice( idx, 1 );

			if ( this._selectedObjectId === obj.uuid ) {

				this.setField( 'selectedObjectId', '' );

			}

			this.emit( 'object/removed', [ obj ] );

		}

	}

	selectObject( obj: SceneObject | null ) {

		this.setField( 'selectedObjectId', obj ? obj.uuid : '' );

	}

}
