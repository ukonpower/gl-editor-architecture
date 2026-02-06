import { useMemo } from 'react';

import { EditorApp } from './editor/EditorApp';
import { createDemoScene } from './demo/createDemoScene';

function App() {

	const scene = useMemo( () => createDemoScene(), [] );

	return <EditorApp scene={ scene } />;

}

export default App;
