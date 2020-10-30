"use strict";

let MSGame = (function(){

  // private constants
  const STATE_HIDDEN = "hidden";
  const STATE_SHOWN = "shown";
  const STATE_MARKED = "marked";

  function array2d( nrows, ncols, val) {
    const res = [];
    for( let row = 0 ; row < nrows ; row ++) {
      res[row] = [];
      for( let col = 0 ; col < ncols ; col ++)
        res[row][col] = val(row,col);
    }
    return res;
  }

  // returns random integer in range [min, max]
  function rndInt(min, max) {
    [min,max] = [Math.ceil(min), Math.floor(max)]
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  class _MSGame {
    constructor() {
      this.init(8,10,10); // easy
    }

    validCoord(row, col) {
      return row >= 0 && row < this.nrows && col >= 0 && col < this.ncols;
    }

    init(nrows, ncols, nmines) {
      this.nrows = nrows;
      this.ncols = ncols;
      this.nmines = nmines;
      this.nmarked = 0;
      this.nuncovered = 0;
      this.exploded = false;
      // create an array
      this.arr = array2d(
        nrows, ncols,
        () => ({mine: false, state: STATE_HIDDEN, count: 0}));
    }

    count(row,col) {
      const c = (r,c) =>
            (this.validCoord(r,c) && this.arr[r][c].mine ? 1 : 0);
      let res = 0;
      for( let dr = -1 ; dr <= 1 ; dr ++ )
        for( let dc = -1 ; dc <= 1 ; dc ++ )
          res += c(row+dr,col+dc);
      return res;
    }
    sprinkleMines(row, col) {
        // prepare a list of allowed coordinates for mine placement
      let allowed = [];
      for(let r = 0 ; r < this.nrows ; r ++ ) {
        for( let c = 0 ; c < this.ncols ; c ++ ) {
          if(Math.abs(row-r) > 2 || Math.abs(col-c) > 2)
            allowed.push([r,c]);
        }
      }
      this.nmines = Math.min(this.nmines, allowed.length);
      for( let i = 0 ; i < this.nmines ; i ++ ) {
        let j = rndInt(i, allowed.length-1);
        [allowed[i], allowed[j]] = [allowed[j], allowed[i]];
        let [r,c] = allowed[i];
        this.arr[r][c].mine = true;
      }
      // erase any marks (in case user placed them) and update counts
      for(let r = 0 ; r < this.nrows ; r ++ ) {
        for( let c = 0 ; c < this.ncols ; c ++ ) {
          if(this.arr[r][c].state == STATE_MARKED)
            this.arr[r][c].state = STATE_HIDDEN;
          this.arr[r][c].count = this.count(r,c);
        }
      }
      let mines = []; let counts = [];
      for(let row = 0 ; row < this.nrows ; row ++ ) {
        let s = "";
        for( let col = 0 ; col < this.ncols ; col ++ ) {
          s += this.arr[row][col].mine ? "B" : ".";
        }
        s += "  |  ";
        for( let col = 0 ; col < this.ncols ; col ++ ) {
          s += this.arr[row][col].count.toString();
        }
        mines[row] = s;
      }
      console.log("Mines and counts after sprinkling:");
      console.log(mines.join("\n"), "\n");
    }
    // uncovers a cell at a given coordinate
    // this is the 'left-click' functionality
    uncover(row, col) {
      console.log("uncover", row, col);
      // if coordinates invalid, refuse this request
      if( ! this.validCoord(row,col)) return false;
      // if this is the very first move, populate the mines, but make
      // sure the current cell does not get a mine
      if( this.nuncovered === 0)
        this.sprinkleMines(row, col);
      // if cell is not hidden, ignore this move
      if( this.arr[row][col].state !== STATE_HIDDEN) return false;
      // floodfill all 0-count cells
      const ff = (r,c) => {
        if( ! this.validCoord(r,c)) return;
        if( this.arr[r][c].state !== STATE_HIDDEN) return;
        this.arr[r][c].state = STATE_SHOWN;
        this.nuncovered ++;
        if( this.arr[r][c].count !== 0) return;
        ff(r-1,c-1);ff(r-1,c);ff(r-1,c+1);
        ff(r  ,c-1);         ;ff(r  ,c+1);
        ff(r+1,c-1);ff(r+1,c);ff(r+1,c+1);
      };
      ff(row,col);
      // have we hit a mine?
      if( this.arr[row][col].mine) {
        this.exploded = true;
      }
      return true;
    }
    // puts a flag on a cell
    // this is the 'right-click' or 'long-tap' functionality
    mark(row, col) {
      console.log("mark", row, col);
      // if coordinates invalid, refuse this request
      if( ! this.validCoord(row,col)) return false;
      // if cell already uncovered, refuse this
      console.log("marking previous state=", this.arr[row][col].state);
      if( this.arr[row][col].state === STATE_SHOWN) return false;
      // accept the move and flip the marked status
      this.nmarked += this.arr[row][col].state == STATE_MARKED ? -1 : 1;
      this.arr[row][col].state = this.arr[row][col].state == STATE_MARKED ?
        STATE_HIDDEN : STATE_MARKED;
      return true;
    }
    // returns array of strings representing the rendering of the board
    //      "H" = hidden cell - no bomb
    //      "F" = hidden cell with a mark / flag
    //      "M" = uncovered mine (game should be over now)
    // '0'..'9' = number of mines in adjacent cells
    getRendering() {
      const res = [];
      for( let row = 0 ; row < this.nrows ; row ++) {
        let s = "";
        for( let col = 0 ; col < this.ncols ; col ++ ) {
          let a = this.arr[row][col];
          if( this.exploded && a.mine) s += "M";
          else if( a.state === STATE_HIDDEN) s += "H";
          else if( a.state === STATE_MARKED) s += "F";
          else if( a.mine) s += "M";
          else s += a.count.toString();
        }
        res[row] = s;
      }
      return res;
    }
    getStatus() {
      let done = this.exploded ||
          this.nuncovered === this.nrows * this.ncols - this.nmines;
      return {
        done: done,
        exploded: this.exploded,
        nrows: this.nrows,
        ncols: this.ncols,
        nmarked: this.nmarked,
        nuncovered: this.nuncovered,
        nmines: this.nmines
      }
    }
  }

  return _MSGame;

})();


$(document).ready(function() {
  $.event.special.tap.emitTapOnTaphold = false;

  function init_game_size() {
    const window_height = $(window).height()
    const window_width = $(window).width()
    let board_width = 800;
    let board_height = 800;
    if (window_width < 800) {
      board_width = window_width;
      board_height = window_width;
    }
    $('#the_board').height(board_height);
    $('#the_board').width(board_width); 
  }

  let game = new MSGame();

  let nrow = 14;
  let ncol = 18;
  let nmine = 30;

  let nmoves = 0;
  let nflags = 30;
  let nflagsmax = 30;

  const DIFFICULTY_EASY = 'easy';
  const DIFFICULTY_NORMAL = 'normal';
  const DIFFICULTY_HARD = 'hard';
  const DIFFICULTY_DEFAULT = 'default';
  const DIFFICULTY_CUSTOM = 'custom';

  let time_counter = 0;
  let time_elapsed = 0;

  function paint_the_board(gamestate) {
    for (let row = 0; row < nrow; row++) {
      for (let col = 0; col < ncol; col++) {
        if (gamestate[row][col] === 'M') {
          $('#cell_' + row + '_' + col).removeClass('hidden_cell');
          $('#cell_' + row + '_' + col).addClass('cell_mine');
        } else if (gamestate[row][col] !== 'M' && gamestate[row][col] !== 'H' && gamestate[row][col] !== 'F') {
          $('#cell_' + row + '_' + col).removeClass('hidden_cell');
          $('#cell_' + row + '_' + col).addClass('cell_number_' + gamestate[row][col]);
        } else if (gamestate[row][col] === 'F') {
          $('#cell_' + row + '_' + col).removeClass('hidden_cell');
          $('#cell_' + row + '_' + col).addClass('cell_flag');
        } else if (gamestate[row][col] === 'H') {
          $('#cell_' + row + '_' + col).removeClass('cell_flag');
          $('#cell_' + row + '_' + col).addClass('hidden_cell');
        }
      }
    }
  }

  function announce_game_result() {
    if (game.getStatus().exploded) {
      $('#system_message_lose').popup('open');
    } else {
      $('#system_message_win').popup('open');
    }
    if (time_counter) { 
      clearInterval(time_counter);
    }
  }

  function init_game_board(nrow, ncol, nmine) {
    if (time_counter) { 
      clearInterval(time_counter);
    }
    time_elapsed = 0;
    time_counter = setInterval(
      function() {
        time_elapsed++;
        $('#the_time').text(get_time(time_elapsed));
      }
      , 1000);
    
    $('#the_board').on('contextmenu', () => { return false; });
    $('#the_board').empty()
    for (let row = 0; row < nrow; row++) {
      $('#the_board').append('<div class="game-row" id="row_' + row + '">')
      for (let col = 0; col < ncol; col++) {
        $('#row_' + row).append('<div class="game-cell ui-btn hidden_cell" id="cell_' + row + '_' + col + '">')
        $('#cell_' + row + '_' + col).on('mousedown', function(event) {
          console.log('mousedown triggered');
          if (game.getStatus().done === false) {
            if (event.which === 3) {
              // right click
              if (game.getRendering()[row][col] === 'F' || nflags > 0) {
                game.mark(row, col);
                nflags = nflagsmax - game.getStatus().nmarked;
                nmoves++;
              }
            }
            paint_the_board(game.getRendering())
            if (game.getStatus().done === true) {
              announce_game_result()
            }
          }
          update_board_status();
        });
        // $('#cell_' + row + '_' + col).on('vclick', function(event) {
        //   console.log('vclick triggered');
        //   if (game.getStatus().done === false) {
        //     if (event.which === 1) {
        //       // left click
        //       game.uncover(row, col);
        //       nmoves++;
        //     }
        //     paint_the_board(game.getRendering())
        //     if (game.getStatus().done === true) {
        //       announce_game_result()
        //     }
            
        //   }
        //   update_board_status();
        // });
        $('#cell_' + row + '_' + col).on('tap', function(event) {
          console.log('tap triggered');
          if (game.getStatus().done === false) {
            game.uncover(row, col);
            nmoves++;
            paint_the_board(game.getRendering())
            if (game.getStatus().done === true) {
              announce_game_result()
            }
          }
          update_board_status();
        });
        $('#cell_' + row + '_' + col).on('taphold', function(event) {
          console.log('taphold triggered');
          if (game.getStatus().done === false && (game.getRendering()[row][col] === 'F' || nflags > 0)) {
            game.mark(row, col);
            nflags = nflagsmax - game.getStatus().nmarked;
            paint_the_board(game.getRendering())
            if (game.getStatus().done === true) {
              announce_game_result()
            }
            nmoves++;
          }
          update_board_status();
        });
      }
    }
    update_board_status();
    let width_per_cell = Math.floor($('#the_board').width() / ncol);
    $('.game-cell').width(width_per_cell);
    $('.game-cell').height(width_per_cell);
    game.init(nrow, ncol, nmine);    
  }

  function get_time(time_in_seconds) {
    let hours = Math.floor(time_in_seconds / 3600);
    let minutes = Math.floor((time_in_seconds - (hours * 3600)) / 60);
    let seconds = time_in_seconds - (hours * 3600) - (minutes * 60);
    return hours + ' hour : ' + minutes + ' minute(s) :' + seconds + ' second(s)'
  }

  function update_board_status() {
    $('#the_number_of_moves').text('Moves used: ' + nmoves + ' move(s)');
    $('#the_number_of_flags_left').text('Flag(s) left: ' + nflags);
  }

  function set_difficulty_settings_and_start_game() {
    init_game_size();
    let difficulty = $('#select_difficulty').val();
    switch (difficulty) {
      case DIFFICULTY_NORMAL:
      case DIFFICULTY_DEFAULT:
        nrow = 14;
        ncol = 18;
        nmine = 40;
        nmoves = 0;
        nflags = 40;
        nflagsmax = 40;
        break;
      case DIFFICULTY_EASY:
        nrow = 8;
        ncol = 10;
        nmine = 10;
        nmoves = 0;
        nflags = 10;
        nflagsmax = 10;
        break;
      case DIFFICULTY_HARD:
        nrow = 20;
        ncol = 24;
        nmine = 99;
        nmoves = 0;
        nflags = 99;
        nflagsmax = 99;
        break;
      default:
        nrow = 14;
        ncol = 18;
        nmine = 30;
        nmoves = 0;
        nflags = 40;
        nflagsmax = 40;
        break;
    }
    init_game_board(nrow, ncol, nmine);
  }

  $('#select_difficulty').on('change', set_difficulty_settings_and_start_game)
  $('#restart_button').on('vclick tap', set_difficulty_settings_and_start_game)
  // init_game_size();
  set_difficulty_settings_and_start_game();
})
