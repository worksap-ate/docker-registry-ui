var padding = 100;
var width = 200 + padding;
var col_per_row = 4;

setTiles(4);

function setTiles(col_per_row) {
  $(".tile").each(function(i) {
    var col = i % col_per_row;
    var row = Math.floor(i / col_per_row);
    $(this).css({
      left: col * width,
      top: row * width
    });
  });
}

