import { useMemo, useEffect } from 'react';

import { EditorApp } from './editor/EditorApp';
import { createDemoScene } from './demo/createDemoScene';
import { animateDemoScene } from './demo/animateDemoScene';

function App() {

	const scene = useMemo( () => createDemoScene(), [] );

	useEffect( () => {

		const dispose = animateDemoScene( scene );
		return dispose;

	}, [ scene ] );

	return <EditorApp scene={ scene } />;

}

export default App;
