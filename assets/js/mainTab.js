
    var tabContent = $('.tab-content');
    var games = $("#games");
    var room = $("#room");
    var rank = $("#rank");
    var info = $("#info");

    function allRemoveActive(){
        games.removeClass('active');
        room.removeClass('active');
        rank.removeClass('active');
        info.removeClass('active');
    }

    games.click( function(){
      allRemoveActive();
      games.addClass('active');
    
      tabContent
        .removeClass('info')
        .removeClass('games')
        .removeClass('room')
        .removeClass('rank')
        .addClass('games');
    });

    room.click( function(){
      allRemoveActive();
      room.addClass('active');
    
      tabContent
        .removeClass('info')
        .removeClass('games')
        .removeClass('room')
        .removeClass('rank')
        .addClass('room');
    });

    rank.click( function(){
      allRemoveActive();
      rank.addClass('active');
    
      tabContent
        .removeClass('info')
        .removeClass('games')
        .removeClass('room')
        .removeClass('rank')
        .addClass('rank');
    });

    info.click( function(){
      allRemoveActive();
      info.addClass('active');
    
      tabContent
        .removeClass('info')
        .removeClass('games')
        .removeClass('room')
        .removeClass('rank')
        .addClass('info');
    });
