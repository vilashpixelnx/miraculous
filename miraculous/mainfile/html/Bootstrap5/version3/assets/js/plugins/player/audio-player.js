$(function() {
    "use strict";
    if ($('.audio-player').length) {
		var myPlayListOtion = '<ul class="more_option"><li><a href="#"><span class="opt_icon" title="Add To Favourites"><span class="icon icon_fav"></span></span></a></li><li><a href="#"><span class="opt_icon" title="Add To Queue"><span class="icon icon_queue"></span></span></a></li><li><a href="#"><span class="opt_icon" title="Download Now"><span class="icon icon_dwn"></span></span></a></li><li><a href="#"><span class="opt_icon" title="Add To Playlist"><span class="icon icon_playlst"></span></span></a></li><li><a href="#"><span class="opt_icon" title="Share"><span class="icon icon_share"></span></span></a></li></ul>';
		
        var myPlaylist = new jPlayerPlaylist({
            jPlayer: "#jquery_jplayer_1",
            cssSelectorAncestor: "#jp_container_1"
        }, [{
			image : 'https://dummyimage.com/100x80',	
            title: "Don't Let me",
            artist: "Mushroom Records",
            mp3: "assets/audio/song-01.mp3",
			option : myPlayListOtion
        }, {
			image : 'https://dummyimage.com/50x50',	
            title: "Your Face",
            artist: "Ministry",
            mp3: "assets/audio/song-02.mp3",
			option : myPlayListOtion
        }, {
			image : 'https://dummyimage.com/50x50',	
            title: "Cyber Sonnet",
            artist: "You Am I",
            mp3: "assets/audio/song-03.mp3",
			option : myPlayListOtion
        }, {
			image : 'https://dummyimage.com/50x50',	
            title: "Tempered Song",
            artist: "Shelter",
            mp3: "assets/audio/song-04.mp3",
			option : myPlayListOtion
        }, {
			image : 'https://dummyimage.com/50x50',	
            title: "Hidden",
            artist: "Bad Religion",
            mp3: "assets/audio/song-05.mp3",
			option : myPlayListOtion
        }], {
            supplied: "mp3",
            wmode: "window",
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            playlistOptions: {
                autoPlay: false
            }
        });

        // song rows: clicking the play icon plays the matching track
        $(document).on('click', '.songslist_play, .ms_play_icon', function(e) {
            e.preventDefault();
            var all = $('.songslist_play, .ms_play_icon');
            myPlaylist.play(all.index(this) % myPlaylist.playlist.length);
        });
        // volume knob: volume comes straight from the knob value (bound once)
        $('.widget').on('knobvalue', function(e, v) {
            if (v <= 0) {
                $("#jquery_jplayer_1").jPlayer("mute");
            } else {
                $("#jquery_jplayer_1").jPlayer("volume", v);
                $("#jquery_jplayer_1").jPlayer("unmute");
            }
        });
        $("#jquery_jplayer_1").on($.jPlayer.event.ready + ' ' + $.jPlayer.event.play, function(event) {
            var current = myPlaylist.current;
            var playlist = myPlaylist.playlist;
            $.each(playlist, function(index, obj) {
                if (index == current) {
                    $(".jp-now-playing").html("<div class='jp-track-name'><span class='que_img'><img src='"+obj.image+"'></span><div class='que_data'>" + obj.title + " <div class='jp-artist-name'>" + obj.artist + "</div></div></div>");
                }
            });


			
			
			
			
            var timeDrag = false;
            $('.jp-play-bar').mousedown(function(e) {
                timeDrag = true;
                updatebar(e.pageX);
				
            });
            $(document).mouseup(function(e) {
                if (timeDrag) {
                    timeDrag = false;
                    updatebar(e.pageX);
                }
            });
            $(document).mousemove(function(e) {
                if (timeDrag) {
                    updatebar(e.pageX);
                }
            });
            var updatebar = function(x) {
                var progress = $('.jp-progress');
                var position = x - progress.offset().left;
                var percentage = 100 * position / progress.width();
                if (percentage > 100) {
                    percentage = 100;
                }
                if (percentage < 0) {
                    percentage = 0;
                }
                $("#jquery_jplayer_1").jPlayer("playHead", percentage);
                $('.jp-play-bar').css('width', percentage + '%');
            };
            $('#playlist-toggle, #playlist-text, #playlist-wrap li a').unbind().on('click', function() {
                $('#playlist-wrap').fadeToggle();
                $('#playlist-toggle, #playlist-text').toggleClass('playlist-is-visible');
            });
            $('.hide_player').unbind().on('click', function() {
                $('.audio-player').toggleClass('is_hidden');
                $(this).html($(this).html() == '<i class="fa fa-angle-down"></i> HIDE' ? '<i class="fa fa-angle-up"></i> SHOW PLAYER' : '<i class="fa fa-angle-down"></i> HIDE');
            });
            $('body').off('click', '.audio-play-btn').on('click', '.audio-play-btn', function() {
                $('.audio-play-btn').removeClass('is_playing');
                $(this).addClass('is_playing');
                var playlistId = $(this).data('playlist-id');
                myPlaylist.play(playlistId);
            });
			
        });
    }
});