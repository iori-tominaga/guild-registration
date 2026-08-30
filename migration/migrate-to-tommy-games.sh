#!/usr/bin/env bash
#
# 自分のゲームリポジトリを oshou35/tommy-games のモノレポに集約する。
# コミット履歴は git subtree で保ったまま games/<slug>/ 以下に載せる。
#
# 使い方（Windows は Git Bash で実行）:
#   bash migration/migrate-to-tommy-games.sh              # 下見（何もしない）
#   APPLY=1 bash migration/migrate-to-tommy-games.sh      # 実行（push はまだしない）
#   APPLY=1 PUSH=1 bash migration/migrate-to-tommy-games.sh  # 実行して push まで
#
# 環境変数で上書きできる設定:
#   WORK_DIR       ゲームリポジトリが並ぶ親ディレクトリ
#   TARGET_URL     集約先リポジトリの URL
#   TARGET_BRANCH  集約先のブランチ
#   STAGE          集約先の作業クローン先
#   ONLY           対象を絞る（スペース区切りのスラッグ）
set -euo pipefail

WORK_DIR="${WORK_DIR:-$HOME/Documents/work}"
TARGET_URL="${TARGET_URL:-https://github.com/oshou35/tommy-games.git}"
TARGET_BRANCH="${TARGET_BRANCH:-main}"
STAGE="${STAGE:-$WORK_DIR/tommy-games}"
ONLY="${ONLY:-}"
APPLY="${APPLY:-0}"
PUSH="${PUSH:-0}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/template"

say()  { printf '\033[36m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[33m!!!\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[31mERR\033[0m %s\n' "$*" >&2; exit 1; }

[ -d "$TEMPLATE_DIR" ] || die "テンプレートが見つかりません: $TEMPLATE_DIR"
[ -d "$WORK_DIR" ]     || die "作業ディレクトリが見つかりません: $WORK_DIR"

# ---------------------------------------------------------------- 移行元を探す
# 「.git を持ち、src/index.html がある」ディレクトリをゲームとみなす
GAMES=()
for dir in "$WORK_DIR"/*/; do
  slug="$(basename "$dir")"
  [ "$dir" = "$STAGE/" ] && continue
  [ -d "$dir/.git" ] || continue
  [ -f "$dir/src/index.html" ] || continue
  if [ -n "$ONLY" ]; then
    case " $ONLY " in *" $slug "*) ;; *) continue ;; esac
  fi
  GAMES+=("$slug")
done

[ ${#GAMES[@]} -gt 0 ] || die "移行対象のゲームが $WORK_DIR に見つかりませんでした"

say "移行対象 (${#GAMES[@]}件): ${GAMES[*]}"

# 未コミット・未 push の変更があると subtree で取りこぼすので先に止める
for slug in "${GAMES[@]}"; do
  src="$WORK_DIR/$slug"
  if [ -n "$(git -C "$src" status --porcelain)" ]; then
    die "$slug に未コミットの変更があります。コミットしてから実行してください"
  fi
  # git subtree は浅いクローンから履歴を取り込めない
  if [ "$(git -C "$src" rev-parse --is-shallow-repository 2>/dev/null)" = "true" ]; then
    warn "$slug は浅いクローンです。履歴を取得します (git fetch --unshallow)"
    git -C "$src" fetch --unshallow \
      || die "$slug の履歴を取得できませんでした。手動で clone し直してください"
  fi
done

if [ "$APPLY" != "1" ]; then
  say "下見モードです。実行するには APPLY=1 を付けてください"
  for slug in "${GAMES[@]}"; do
    branch="$(git -C "$WORK_DIR/$slug" rev-parse --abbrev-ref HEAD)"
    printf '    %-24s %s -> games/%s/\n' "$slug" "($branch)" "$slug"
  done
  exit 0
fi

# ---------------------------------------------------------------- 集約先を用意
if [ ! -d "$STAGE/.git" ]; then
  say "集約先をクローン: $TARGET_URL -> $STAGE"
  git clone "$TARGET_URL" "$STAGE"
fi

cd "$STAGE"
# 取り違え防止：STAGE が本当に TARGET_URL のクローンか確かめる
stage_origin="$(git remote get-url origin 2>/dev/null || true)"
[ "$stage_origin" = "$TARGET_URL" ] \
  || die "$STAGE の origin が集約先と一致しません（origin=$stage_origin / 期待=$TARGET_URL）"

if git rev-parse --verify "refs/heads/$TARGET_BRANCH" >/dev/null 2>&1; then
  git checkout "$TARGET_BRANCH"
elif git rev-parse --verify "refs/remotes/origin/$TARGET_BRANCH" >/dev/null 2>&1; then
  git checkout -b "$TARGET_BRANCH" "origin/$TARGET_BRANCH"
else
  git checkout -b "$TARGET_BRANCH"
fi

# 空リポジトリだと subtree add できないので、最初のコミットを作る
if ! git rev-parse HEAD >/dev/null 2>&1; then
  say "空リポジトリなので初期コミットを作成"
  printf '# Tommy Games\n' > README.md
  git add README.md
  git commit -m "chore: initial commit"
fi

[ -z "$(git status --porcelain)" ] || die "$STAGE に未コミットの変更があります"

# ---------------------------------------------------------------- 履歴ごと取込
#
# 各ゲームを一時クローンし、履歴上の全パスを games/<slug>/ 配下へ書き換えてから
# マージする。こうすると集約後も `git log games/<slug>/src/foo.html` や
# `git blame` がファイル単位で最後まで遡れる。
# （元のリポジトリには一切触らない。書き換えるのは一時クローンだけ）
TMP_ROOT="$(mktemp -d)"
cleanup() { rm -rf "$TMP_ROOT"; }
trap cleanup EXIT

for slug in "${GAMES[@]}"; do
  src="$WORK_DIR/$slug"
  branch="$(git -C "$src" rev-parse --abbrev-ref HEAD)"

  if [ -d "games/$slug" ]; then
    say "games/$slug は既にあります。スキップ"
    continue
  fi

  say "取り込み: $slug ($branch) -> games/$slug/"

  tmp="$TMP_ROOT/$slug"
  git clone --quiet --no-hardlinks --branch "$branch" --single-branch "$src" "$tmp"

  # 全コミットのパス先頭に games/<slug>/ を付ける
  filter="git -c core.quotepath=false ls-files -s"
  filter="$filter | sed \"s|\\t|&games/$slug/|\""
  filter="$filter | GIT_INDEX_FILE=\$GIT_INDEX_FILE.new git update-index --index-info"
  filter="$filter && mv \"\$GIT_INDEX_FILE.new\" \"\$GIT_INDEX_FILE\""

  FILTER_BRANCH_SQUELCH_WARNING=1 \
    git -C "$tmp" filter-branch --force --prune-empty --index-filter "$filter" -- "$branch" >/dev/null

  git fetch --quiet "$tmp" "$branch"
  git merge --allow-unrelated-histories --no-edit \
    -m "chore($slug): $slug を履歴ごと games/$slug/ に取り込み" FETCH_HEAD

  # 入れ子の .github はルートの workflow しか動かないため取り除く
  if [ -d "games/$slug/.github" ]; then
    git rm -r --quiet "games/$slug/.github"
    git commit -m "chore($slug): モノレポ集約にともない入れ子の .github を削除"
  fi
done

# ---------------------------------------------------------------- 土台を整える
say "モノレポの土台ファイルを配置"
mkdir -p .github/workflows
cp "$TEMPLATE_DIR/.github/workflows/deploy.yml" .github/workflows/deploy.yml
cp "$TEMPLATE_DIR/index.html" index.html
cp "$TEMPLATE_DIR/README.md" README.md
mkdir -p .claude
cp "$TEMPLATE_DIR/CLAUDE.md" .claude/CLAUDE.md
[ -f .gitignore ] || cp "$TEMPLATE_DIR/gitignore" .gitignore

# ランチャーに出す各ゲームのメタ情報
for slug in "${GAMES[@]}"; do
  meta="games/$slug/game.json"
  [ -d "games/$slug" ] || continue
  [ -f "$meta" ] && continue

  case "$slug" in
    guild-registration)
      title='冒険者ギルド'; emoji='🛡️'; tags='"RPG", "React"'
      desc='ドラゴンクエストふうの ぼうけんしゃギルド。とうろく・そうび・じゅもん・バトル。' ;;
    goki100)
      title='ゴキブリは1匹みたら100匹いると思え'; emoji='🪳'; tags='"3D", "Three.js"'
      desc='いえの なかで ゴキブリを ふやして 100ぴきを めざす 3D いくせいゲーム。' ;;
    crowd-run)
      title='crowd-run'; emoji='🏃'; tags='"3D", "Three.js"'
      desc='たたかいながら クイズに こたえて ぐんだんを ふやす 3レーン シューター。' ;;
    *)
      title="$slug"; emoji='🎮'; tags=''
      desc='' ;;
  esac

  cat > "$meta" <<JSONEOF
{
  "title": "$title",
  "emoji": "$emoji",
  "description": "$desc",
  "tags": [$tags]
}
JSONEOF
done

git add -A
if [ -n "$(git status --porcelain)" ]; then
  git commit -m "ver. 1.0.0: ゲームをモノレポに集約

[add]
- ゲームランチャー（games.json から一覧を生成）を追加
- games/<name>/src/ をまとめて配信する GitHub Pages ワークフローを追加
- 各ゲームの game.json（ランチャー表示用メタ情報）を追加

[change]
- $(printf '%s ' "${GAMES[@]}")を履歴ごと games/ 配下へ集約"
else
  say "土台ファイルに変更はありませんでした"
fi

# ---------------------------------------------------------------- push
if [ "$PUSH" = "1" ]; then
  say "push: origin $TARGET_BRANCH"
  git push -u origin "$TARGET_BRANCH"
else
  say "push はしていません。中身を確認したら次を実行してください:"
  printf '    git -C "%s" push -u origin %s\n' "$STAGE" "$TARGET_BRANCH"
fi

say "完了。集約先: $STAGE"
