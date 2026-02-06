# gl-editor-architecture

Canvas 2Dベースのシーンエディタ。
basepowerライブラリの`Serializable`フィールドシステムを中心に、Reactの状態管理とCanvas描画を**イベント駆動**で統合するアーキテクチャデモ。

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Serializable                             │
│  ┌──────────────┐   field()    ┌──────────────────────────┐     │
│  │  SceneObject  │────────────▶│ transform/x, style/color │     │
│  │  (extends)    │             │ ... (getter/setter pairs) │     │
│  └──────────────┘             └──────────────────────────┘     │
│         │                              │                        │
│         │ setField()                   │ emit("fields/update")  │
│         ▼                              ▼                        │
│  ┌──────────────────────────────────────────────┐               │
│  │              EventEmitter                     │               │
│  │  "fields/update/{path}" / "fields/update"     │               │
│  └─────────────┬──────────────────┬─────────────┘               │
└────────────────┼──────────────────┼─────────────────────────────┘
                 │                  │
       ┌─────────▼──────┐   ┌──────▼──────────────┐
       │ React Hooks     │   │ Canvas Renderer      │
       │ (state update)  │   │ (reads getters       │
       │ → re-render UI  │   │  every frame via rAF) │
       └────────────────┘   └─────────────────────┘
```

UIでの値変更もCanvas上のオブジェクト状態も、すべて`Serializable`のフィールドを単一のソースとして動作する。

## Serializable Field System

basepowerの`Serializable`クラスは、getter/setterペアでフィールドを登録し、変更時にイベントを自動発火する仕組みを提供する。

### フィールド定義

`SceneObject`では`fieldDir()`でグループ化したフィールドを定義する。

```ts
// src/scene/SceneObject.ts
export abstract class SceneObject extends Serializable {
  private _x = 0;
  private _color = '#ffffff';

  constructor(name: string) {
    super();
    // 単体フィールド
    this.field('name', () => this._name, (v) => { this._name = v; });

    // グループ化フィールド（パスは "transform/x" になる）
    const transformDir = this.fieldDir('transform');
    transformDir.field('x', () => this._x, (v) => { this._x = v; }, { step: 1 });

    const styleDir = this.fieldDir('style');
    styleDir.field('color', () => this._color, (v) => { this._color = v; });
  }
}
```

### イベント発火の流れ

`setField()`を呼ぶと、内部で以下のイベントが発火する。

```
setField("transform/x", 200)
  → setter実行（_x = 200）
  → emit("fields/update/transform/x")   // 特定フィールド用
  → emit("fields/update", [["transform/x"]])  // 全体購読用
```

## React Hooks — Serializable と React の接続

`basepower/src/react/`に2つのhooksを用意し、Serializableのイベントをreactの再レンダリングに変換する。

### useSerializableField

個別フィールドの双方向バインド。`useState`風の `[value, setter]` を返す。

```ts
function useSerializableField<T>(
  serializable: Serializable | null,
  fieldPath: string
): [T | undefined, (value: T) => void]
```

内部では `"fields/update/{fieldPath}"` イベントを購読し、変更があれば `getField()` で最新値を取得してReact stateを更新する。setterは `setField()` を呼ぶだけなので、イベント経由で自動的にUIに反映される。

**使用例 — NumberField（プロパティエディタ）:**

```tsx
// src/editor/panels/PropertyPanel/fields/NumberField.tsx
export function NumberField({ serializable, path, label, opt }) {
  const [value, setValue] = useSerializableField<number>(serializable, path);

  return (
    <input
      type="number"
      value={value ?? 0}
      onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
    />
  );
}
```

**使用例 — EditorContext（選択状態の共有）:**

```tsx
// src/editor/EditorContext.tsx
const [selectedId] = useSerializableField<string>(scene, 'selectedObjectId');
const selectedObject = objects.find(o => o.uuid === selectedId) ?? null;
```

`Scene`の`selectedObjectId`フィールドもSerializableフィールドなので、HierarchyやViewportからの選択変更が自動的にPropertyPanelに伝播する。

### useWatchSerializable

Serializableの全フィールド変更（またはdeps指定のサブセット）を購読し、`serialize()`のスナップショットを返す。

```ts
function useWatchSerializable<T extends Serializable>(
  serializable: T | null,
  deps?: string[]
): SerializedFields | null
```

**使用例 — HierarchyPanel（名前・表示状態の監視）:**

```tsx
// src/editor/panels/HierarchyPanel/HierarchyPanel.tsx
function HierarchyItem({ obj }: { obj: SceneObject }) {
  // "name" or "style/visible" が変わった時だけ再レンダリング
  const fields = useWatchSerializable(obj, ['name', 'style/visible']);
  const name = fields?.['name'] as string;
  const visible = fields?.['style/visible'] as boolean;
  // ...
}
```

**使用例 — SerializableFieldView（スキーマ再構築）:**

```tsx
// src/editor/panels/PropertyPanel/SerializableFieldView.tsx
export function SerializableFieldView({ serializable }) {
  useWatchSerializable(serializable); // deps未指定 → 全変更で再レンダリング
  const schema = serializable.getSchema(); // 最新のスキーマツリーを取得
  // schema を再帰的に走査してUIを生成...
}
```

## Canvas Renderer — Serializable との連携

Canvasの描画ループはReactとは独立して動作する。`requestAnimationFrame`で毎フレーム`SceneObject`のgetterから最新値を直接読み取る。

```tsx
// src/editor/panels/ViewportPanel/CanvasViewport.tsx
useEffect(() => {
  const renderer = new Renderer(canvas);
  let animId: number;

  const loop = () => {
    renderer.render(scene);  // 毎フレーム scene.objects の状態を直接読む
    animId = requestAnimationFrame(loop);
  };

  animId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(animId);
}, [scene]);
```

`Renderer.render()`は各オブジェクトの`x`, `y`, `width`, `color`等のgetterを呼ぶため、`setField()`で値が変わった瞬間から次フレームで描画に反映される。Reactの再レンダリングを待つ必要がない。

```
PropertyPanel入力 → setField("transform/x", 200)
  → SceneObject._x = 200（即座）
  → 次フレームの rAF で Renderer が obj.x（= 200）を読む → Canvas描画更新
  → 同時に emit → useSerializableField → React state更新 → UI表示も更新
```

## Schema-Driven Property UI

`Serializable.getSchema()`が返すツリー構造から、PropertyPanelのUIを自動生成する。

```
getSchema() の戻り値:
{
  type: "group",
  childs: {
    name: { type: "field", value: "Blue Box" },
    transform: {
      type: "group",
      childs: {
        x: { type: "field", value: 80, opt: { step: 1 } },
        y: { type: "field", value: 60, opt: { step: 1 } },
        ...
      }
    },
    style: {
      type: "group",
      childs: {
        color: { type: "field", value: "#4a7fff" },
        visible: { type: "field", value: true },
      }
    }
  }
}
```

`SerializableFieldView`がこのツリーを再帰走査し、`SchemaGroup`は折りたたみセクション、`SchemaField`は値の型に応じたフィールドエディタ（NumberField, ColorField等）を描画する。新しいフィールドを`SceneObject`に追加するだけで、PropertyPanelに自動的にUIが生成される。

## Directory Structure

```
├── basepower/                     # git submodule (EventEmitter / Serializable)
│   └── src/
│       ├── react/                 # React統合hooks
│       │   ├── useWatchSerializable.ts
│       │   └── useSerializableField.ts
│       ├── EventEmitter/
│       └── Serializable/
├── src/
│   ├── scene/
│   │   ├── Scene.ts               # オブジェクト管理・選択状態
│   │   ├── SceneObject.ts         # 基底クラス（フィールド定義）
│   │   ├── objects/
│   │   │   ├── Rectangle.ts
│   │   │   └── Circle.ts
│   │   └── Renderer.ts            # Canvas 2D描画
│   ├── editor/
│   │   ├── EditorContext.tsx       # Scene/選択状態のContext Provider
│   │   ├── EditorApp.tsx           # 3パネルレイアウト
│   │   └── panels/
│   │       ├── HierarchyPanel/    # オブジェクトリスト
│   │       ├── ViewportPanel/     # Canvas + rAFループ
│   │       └── PropertyPanel/     # スキーマ駆動プロパティエディタ
│   │           ├── SerializableFieldView.tsx
│   │           └── fields/        # Number / String / Boolean / Color
│   └── demo/
│       └── createDemoScene.ts
├── vite.config.ts
└── tsconfig.app.json
```

## Setup

```bash
git clone --recursive <repo-url>
cd gl-editor-architecture
npm install
npm run dev
```

## License

MIT
