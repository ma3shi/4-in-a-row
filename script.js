// ルール
class Rule {
  constructor() {
    this.ruleContent = document.getElementById('rule'); //ルール内容
    const ruleBtn = document.getElementById('show-rule'); //ルールボタン
    this.overlayBlur = document.getElementById('overlay-blur'); //ぼかし
    const closeRuleBtn = document.getElementById('close-rule'); //ルールを閉じるボタン
    ruleBtn.addEventListener('click', () => this.openRule()); //ルールを開く
    closeRuleBtn.addEventListener('click', () => this.closeRule()); //ルールを閉じる
    this.overlayBlur.addEventListener('click', () => this.closeoverlayBlur()); //ぼかしを消す
  }

  //ルールを開く
  openRule() {
    this.ruleContent.classList.add('show');
    this.overlayBlur.classList.remove('hidden');
  }

  //ルールを閉じる
  closeRule() {
    this.ruleContent.classList.remove('show');
    this.overlayBlur.classList.add('hidden');
  }

  //ぼかしを消す
  closeoverlayBlur() {
    this.ruleContent.classList.remove('show');
    this.overlayBlur.classList.add('hidden');
  }
}

// パネル
class Panel {
  constructor(row, col, game) {
    this.game = game; //ゲーム
    this.panelEl = document.createElement('div'); //div要素を作成
    this.panelEl.id = row.toString() + '-' + col.toString(); //idに行-列を代入
    this.panelEl.classList.add('panel'); //panelクラスを追加
    //クリックイベント
    this.panelEl.addEventListener('click', () => {
      this.game.checkPanel(this); //パネルチェック
    });
  }
}

//ボード
class Board {
  constructor(game) {
    this.game = game; //ゲーム
    this.rowNum = 6; //行数
    this.colNum = 7; //列数
    this.boardEl = document.getElementById('board'); //ボード要素
    this.createBoard(); //ボード作成
  }
  //ボード作成
  createBoard() {
    for (let r = 0; r < this.rowNum; r++) {
      const row = []; //パネルを取ったプレイヤー番号を記録する用の行配列

      for (let c = 0; c < this.colNum; c++) {
        row.push(' '); //空白を列の数分push
        let panel = new Panel(r, c, this.game); //パネル作成
        this.boardEl.appendChild(panel.panelEl); //boardにpanelを付け加える
      }
      this.game.getPlayerNums.push(row); //パネルを取ったプレイヤー番号を記録する配列に行配列をpush
    }
  }
}

//ゲーム
class Game {
  constructor() {
    this.rule = new Rule(); // ルール
    this.getPlayerNums = []; //パネルを取ったプレイヤー番号を記録する二次元配列
    this.board = new Board(this); //ボード
    this.playerOne = 1; //プレイヤー1
    this.playerTwo = 2; //プレイヤー2
    this.currentPlayer = this.playerOne; //現在のプレイヤー
    this.isStartGame = false; //ゲームをスタートしたか
    this.isGameOver = false; //ゲームオーバーか
    this.getRowPosition; //各列における取得可能な行番号
    this.startPosition; //天井スタートか床スタートか

    this.messageEl = document.getElementById('message'); //メッセージ
    this.startFloorBtn = document.getElementById('start-floor'); //床スタートボタン
    this.startCellingBtn = document.getElementById('start-celling'); //天井スタートボタン
    this.startBtn = document.getElementById('start'); //スタートボタン
    this.resetBtn = document.getElementById('reset'); //リセットボタン

    //床スタートボタンをクリック
    this.startFloorBtn.addEventListener('click', () => {
      if (this.isStartGame) return; //ゲーム開始後は使用不可
      this.startFloorBtn.classList.add('start-position');
      this.startCellingBtn.classList.remove('start-position');
    });

    //天井スタートボタンをクリック
    this.startCellingBtn.addEventListener('click', () => {
      if (this.isStartGame) return; //ゲーム開始後は使用不可
      this.startCellingBtn.classList.add('start-position');
      this.startFloorBtn.classList.remove('start-position');
    });

    //スタートボタンをクリック
    this.startBtn.addEventListener('click', () => {
      if (this.isStartGame) return; //ゲーム開始後は使用不可
      this.startGame();
    });

    //リセットボタンをクリック
    this.resetBtn.addEventListener('click', () => {
      this.initGame();
    });
  }

  //初期化
  initGame() {
    //再初期化した際に前のパネルが残らないようにする
    while (this.board.boardEl.firstChild) {
      this.board.boardEl.firstChild.remove();
    }
    this.getPlayerNums = []; //パネルを取ったプレイヤー番号を記録する配列を空にする
    this.board.createBoard(); // ボード作成
    this.messageEl.textContent = ''; //順番表示を空に
    this.currentPlayer = this.playerOne; //現在のプレイヤー
    this.startBtn.classList.remove('inactive'); //スタートボタン使用可
    this.startFloorBtn.classList.remove('inactive'); //床スタートボタン使用可
    this.startCellingBtn.classList.remove('inactive'); //天井スタートボタン使用可
    this.isStartGame = false; //ゲームをスタートしたかをfalseにする
    this.isGameOver = false; //ゲームオーバをfalseにする
  }

  //ゲームスタート
  startGame() {
    this.isStartGame = true;
    this.messageEl.textContent = `プレイヤー ${this.currentPlayer}`; //順番表示
    this.startBtn.classList.add('inactive'); //スタートボタン使用不可
    this.startFloorBtn.classList.add('inactive'); //床スタートボタン使用不可
    this.startCellingBtn.classList.add('inactive'); //天井スタートボタン使用不可
    //スタートポジションが床
    if (this.startFloorBtn.classList.contains('start-position')) {
      this.startPosition = 'floor'; //床
      this.getRowPosition = [5, 5, 5, 5, 5, 5, 5]; //列の状況(どの行のパネルを取れるか)
      //スタートポジションが天井
    } else {
      this.startPosition = 'celling'; //天井
      this.getRowPosition = [0, 0, 0, 0, 0, 0, 0]; //列の状況(どの行のパネルを取れるか)
    }
  }

  //パネルチェック
  checkPanel(panel) {
    if (!this.isStartGame || this.isGameOver) return; //スタートしていないもしくはゲームオーバならreturn

    let coords = panel.panelEl.id.split('-'); //panelのid(座標)を分けて配列に代入
    this.pushRow = parseInt(coords[0]); //整数値にして行番号として代入
    this.col = parseInt(coords[1]); //整数値にして列番号として代入
    this.getRow = this.getRowPosition[this.col]; //クリックした列で取得可能な行番号
    if (this.getRow < 0 || this.getRow > 5) return; //rが0より小さい,5より大きい場合return

    //pushした行番号と取得可能な行番号が一致
    if (this.getRow === this.pushRow) {
      this.getPanel(this.pushRow, this.col); //パネル取得
    }
  }

  //パネル取得
  getPanel(row, col) {
    this.getPlayerNums[row][col] = this.currentPlayer; //そのパネルを取ったプレイヤー番号を二次元配列に代入
    let panelEl = document.getElementById(
      row.toString() + '-' + col.toString()
    ); //パネル要素取得

    //現在のプレイヤーがプレイヤー1
    if (this.currentPlayer === this.playerOne) {
      if (this.startPosition === 'floor') {
        panelEl.classList.add('player-one'); //クラスを追加
        row -= 1; //行を1減らす
      } else {
        panelEl.classList.add('player-one-cell'); //クラスを追加
        row += 1; //行を1増やす
      }
      this.currentPlayer = this.playerTwo; //プレイヤー2に交代
      this.messageEl.textContent = `プレイヤー ${this.currentPlayer}`; //順番表示
      //現在のプレイヤーがプレイヤー2
    } else {
      if (this.startPosition === 'floor') {
        panelEl.classList.add('player-two'); //クラスを追加
        row -= 1; //行を1減らす
      } else {
        panelEl.classList.add('player-two-cell'); //クラスを追加
        row += 1; //行を1増やす
      }

      this.currentPlayer = this.playerOne; //プレイヤー1に交代
      this.messageEl.textContent = `プレイヤー ${this.currentPlayer}`; //順番表示
    }

    this.getRowPosition[col] = row; //列の状況(どの行を取得できるか)を更新

    this.checkGame(); //勝敗判定
  }
  //勝敗判定
  checkGame() {
    const checkNums = 4; //チェックするパネル数
    //水平
    for (let r = 0; r < this.board.rowNum; r++) {
      //列番が0から6の場合、チェックするのは0から3,1から4,2から5,3から6の4件
      for (let c = 0; c <= this.board.colNum - checkNums; c++) {
        //ブランクならばチェックしない
        if (this.getPlayerNums[r][c] != ' ') {
          //水平4列のcurrentPlayerが全て一致
          if (
            this.getPlayerNums[r][c] === this.getPlayerNums[r][c + 1] &&
            this.getPlayerNums[r][c + 1] === this.getPlayerNums[r][c + 2] &&
            this.getPlayerNums[r][c + 2] === this.getPlayerNums[r][c + 3]
          ) {
            this.setGameover(r, c); //ゲーム終了
            return;
          }
        }
      }
    }

    //垂直
    for (let c = 0; c < this.board.colNum; c++) {
      //行番が0から5の場合、チェックするのは0から4,1から5,2から6の3件
      for (let r = 0; r <= this.board.rowNum - checkNums; r++) {
        //ブランクならばチェックしない
        if (this.getPlayerNums[r][c] != ' ') {
          //垂直4行のcurrentPlayerが全て一致
          if (
            this.getPlayerNums[r][c] === this.getPlayerNums[r + 1][c] &&
            this.getPlayerNums[r + 1][c] === this.getPlayerNums[r + 2][c] &&
            this.getPlayerNums[r + 2][c] === this.getPlayerNums[r + 3][c]
          ) {
            this.setGameover(r, c); //ゲーム終了
            return;
          }
        }
      }
    }

    //対角線 右下がり 行0列0から行2列3まで
    for (let r = 0; r <= this.board.rowNum - checkNums; r++) {
      for (let c = 0; c <= this.board.colNum - checkNums; c++) {
        //ブランクならばチェックしない
        if (this.getPlayerNums[r][c] != ' ') {
          // 対角線4つのcurrentPlayerが全て一致
          if (
            this.getPlayerNums[r][c] === this.getPlayerNums[r + 1][c + 1] &&
            this.getPlayerNums[r + 1][c + 1] ===
              this.getPlayerNums[r + 2][c + 2] &&
            this.getPlayerNums[r + 2][c + 2] ===
              this.getPlayerNums[r + 3][c + 3]
          ) {
            this.setGameover(r, c); //ゲーム終了
            return;
          }
        }
      }
    }

    //対角線　右上がり 行5列0から行3列3まで
    for (let r = this.board.rowNum - 1; r >= checkNums - 1; r--) {
      for (let c = 0; c <= this.board.colNum - checkNums; c++) {
        //ブランクならばチェックしない
        if (this.getPlayerNums[r][c] !== ' ') {
          // 対角線4つのcurrentPlayerが全て一致
          if (
            this.getPlayerNums[r][c] === this.getPlayerNums[r - 1][c + 1] &&
            this.getPlayerNums[r - 1][c + 1] ===
              this.getPlayerNums[r - 2][c + 2] &&
            this.getPlayerNums[r - 2][c + 2] ===
              this.getPlayerNums[r - 3][c + 3]
          ) {
            this.setGameover(r, c); //ゲーム終了
            return;
          }
        }
      }
    }
  }

  //ゲーム終了
  setGameover(r, c) {
    //最後に置いたパネルがプレイヤー1
    if (this.getPlayerNums[r][c] === this.playerOne) {
      this.messageEl.innerText = 'プレイヤー1の勝ち'; //プレイヤー1の勝ちと表示
      //最後に置いたパネルがプレイヤー2
    } else {
      this.messageEl.innerText = 'プレイヤー2の勝ち'; //プレイヤー2の勝ちと表示
    }
    this.isGameOver = true; //ゲームオーバをtrueにする
  }
}

new Game();
