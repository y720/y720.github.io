$(function() {
  var handleStart = function(event) {
    var request;
    var zhtext;
    var pinyin;
    var num;
    var anshtml;
    var mp3elmid;
    zhtext = $(event.target).data('zh');
    pinyin = $(event.target).data('pinyin');
    num = $(event.target).data('num');
    if(zhtext) {
      $(event.target).css('border', '2px solid #000');
      anshtml = '';
      if(pinyin) {
	anshtml = anshtml + '<ruby>' + zhtext + '<rt>' + pinyin + '</rt></ruby>';
      } else {
	anshtml = anshtml + zhtext;
      }
      mp3elmid = 'mp3elm_' + num;
      anshtml = anshtml + '<br><a class="mp3playa" id="' + mp3elmid + '">-</a>';
      $(event.target).html(anshtml);
      $(event.target).off('touchstart', handleStart);

      // ----------------------------------------
      // 音声MP3データのダウンロード
      // ----------------------------------------
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      var ctx = new AudioContext();
      var elm = document.getElementById(mp3elmid);
      var mp3 = "/mp3/" + zhtext + ".mp3";
      var xhr = new XMLHttpRequest();

      xhr.open('GET', mp3, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
	if(xhr.status == 200) {
	  $(elm).html('<i class="fa fa-play"></i>');
	  $(elm).click(function() {
	    var src = ctx.createBufferSource();

	    // オーディオをデコード
	    ctx.decodeAudioData(xhr.response, function (buf) {
              src.buffer = buf;
              src.loop = false;
              src.connect(ctx.destination);
              src.start(0);
	    });
	  });
        }
      };
      xhr.send(null);

      // ----------------------------------------
      // 15秒後に表示を元に戻す
      // ----------------------------------------
      setTimeout(function() {
        $(event.target).html($(event.target).data('jp'));
        $(event.target).css('border', '2px solid #fff');
        $(event.target).on('touchstart', handleStart);
        ctx.close();
      }, 15000);
    }
  };
  
  var handleEnd = function(event) {
    $(event.target).html($(event.target).data('jp'));
    $(document).off('touchend', handleEnd);
  };

  var q = $.url().param().q;
  var wordsjson = "y7words.json";
  if(q)
    wordsjson = q;

  var time1;
  time1 = new Date();
  $.getJSON("json/" + wordsjson + "?" + time1.getTime(), function(words) {
    var i, cnt, template;
    cnt = 0;
    for(i = 0; i < words.length; i++) {
      if(words[i] && words[i][0] && words[i][0]!=='END') {
        cnt = cnt + 1;
        if(words[i][1]) {
          template = '';
          template = template + '<div class="alert alert-dark alert-dismissible fade show y7alert" role="alert">';
          template = template + '<div class="h3 word"';
          template = template + ' data-jp="' + words[i][0] + '"';
          template = template + ' data-zh="' + words[i][1] + '"';
          template = template + ' data-pinyin="' + words[i][2] + '"';
          template = template + ' data-num="' + cnt + '"';
          template = template + '>' + words[i][0];
          template = template + '</div>';
          template = template + '</div>';
        } else {
          template = '<div>' + words[i][0] + '</div>';
        }
        $("main").append(template);
      }
      $("#navbar1").text(cnt);
    }
    $(".word").on('touchstart', handleStart);
    $(".word").on('click', handleStart);
  });

  //iOS版
  var request;
  var status = 0;


  function downloadMP3(zhtext) {
    request = new XMLHttpRequest();
    request.open("GET", "/mp3/" + zhtext + ".mp3", true);
    request.responseType = "arraybuffer";
    request.onload = completeOnLoad;
    request.send();
  }

  
  function clickPlay() {
    if (status == 0) {
      status = 1;
      request = new XMLHttpRequest();
      request.open("GET", "/mp3/出口仓库.mp3", true);
      request.responseType = "arraybuffer";
      request.onload = completeOnLoad;
      request.send();
    } else if (status == 2) {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new AudioContext();

      source = context.createBufferSource();

      // オーディオをデコード
      context.decodeAudioData(request.response, function (buf) {
        source.buffer = buf;
        source.loop = false;
        source.connect(context.destination);
        source.start(0);
      });
    }
  };

  function completeOnLoad() {
    status = 2;
    var elem = document.getElementById("mp3play1");
    elem.innerText = "再生";
  }

  $("#mp3play1").click(clickPlay);

  
});
