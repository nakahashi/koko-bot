# koko-bot

## 開発者向け情報

### 上位設計書

上位設計書は別途以下のリポジトリに格納しています。

[nakahashi/koko.doc](https://github.com/nakahashi/koko.doc)

### フォルダ構成

 * src: es6で記述したソースファイルです。開発対象コードはこのフォルダ以下となります。
 * test: mochaで記述したテストコードです。
 * doc: esdocで生成したAPIドキュメントです。
 * lib: srcフォルダをbabelでes5に変換したソースファイルです。実行コードはこのフォルダ以下となります。（この手のファイルはgitで管理しないのが定石ですが、デプロイの都合上gitの管理下にしています）
