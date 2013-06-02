(function () {
   var rows = 0;
   var columns = 0;
   var totalMines = 0;
   var mines = null;

   function onGenerateGame() {
      rows = parseInt($('input[name=Rows]').val(), 10);
      columns = parseInt($('input[name=Columns]').val(), 10);
      totalMines = parseInt($('input[name=TotalMines]').val(), 10);

      if (rows && columns && totalMines) {
         generateGame();
      }
   }

   function generateGame() {
      var game = $('.game')

      game.empty();
      mines = {};

      for (var row = 0; row < rows; row++) {
         mines[row] = {};
         var rowEl = $('<div class="row"></div>');

         for (var column = 0; column < columns; column++) {
            mines[row][column] = 0;
            var colEl = $('<div class="cell" data-row="' + row + '" data-column="' + column + '"></div>');

            rowEl.append(colEl);
         }

         game.append(rowEl);
      }

      var actualMines = 0;
      while (actualMines < totalMines) {
         var row = Math.floor(Math.random() * rows);
         var column = Math.floor(Math.random() * columns);

         if (mines[row][column]) {
            continue;
         }

         mines[row][column] = 1;
         actualMines++;
      }
   }

   function onCellClicked() {
      var $cell = $(this);

      if ($cell.is('.pressed')) {
         return;
      }

      var row = parseInt($cell.attr('data-row'), 10);
      var column = parseInt($cell.attr('data-column'), 10);

      if (hasMine(row, column)) {
         $cell.addClass('explode');
         return;
      }
      
      processCell($cell, row, column);
   }

   function processCell($cell, row, column) {
      if ($cell.is('.pressed')) {
         return;
      }

      $cell.addClass('pressed');
      
      var mineCount = getMineCount(row, column);

      if (mineCount == 0) {
         for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
               if (x == 0 && y == 0) continue;

               var newCell = $('.cell[data-row="' + (row + x) + '"][data-column="' + (column + y) + '"]');
               if (newCell.length == 0) continue;

               processCell(newCell, row + x, column + y);
            }
         }
      }
      else {
         $cell.html(mineCount);
      }
   }

   function hasMine(row, column) {
      if (row < 0 || column < 0 || row >= rows || column >= columns) {
         return false;
      }

      return mines[row][column] == 1;
   }

   function getMineCount(row, column) {
      var count = 0;

      for (var x = -1; x <= 1; x++) {
         for (var y = -1; y <= 1; y++) {
            if (hasMine(row + x, column + y)) {
               count++;
            }
         }
      }

      return count;
   }

   function onShowMines() {
      var rows = parseInt($('.game').attr('data-rows'), 10);
      var columns = parseInt($('.game').attr('data-columns'), 10);

      for (var row = 0; row < rows; row++) {
         for (var column = 0; column < columns; column++) {
            if (hasMine(row, column)) {
               var cell = $('.cell[data-row="' + row + '"][data-column="' + column + '"]');
               cell.addClass('explode');
            }
         }
      }
   }

   $(function () {
      $('button[name=Generate]').click(onGenerateGame);
      $('button[name=ShowMines]').click(onShowMines);

      $('.game').on('click', '.cell', onCellClicked);
   });
} ());