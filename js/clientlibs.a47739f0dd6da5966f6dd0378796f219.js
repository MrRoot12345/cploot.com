
// fullscreen

ATVI.fullscreen = {};
(function() {

    var fs = ATVI.fullscreen;
	fs.supported = false;

    var prefixes = "webkit moz o ms".split(" ");

	if (document.cancelFullScreen) {
        fs.supported = true;
        fs.prefix = "";
    } else {
        for(var i = 0; i < prefixes.length; i++) {
            if(document[prefixes[i] + "CancelFullScreen"]) {
				fs.prefix = prefixes[i];
                fs.supported = true;
                break;
            }
        }
    }

    var fullScreenApi = { 
        supportsFullScreen: false,
        isFullScreen: function() {}, 
        requestFullScreen: function() {false}, 
        cancelFullScreen: function() {},
        fullScreenEventName: '',
        prefix: ''
    };

    fs.request = function($el) {
        if(fs.supported) return $($el)[0][fs.prefix ? fs.prefix + "RequestFullScreen" : "requestFullscreen"]();
    };

    fs.cancel = function($el) {
        if(fs.supported) document[fs.prefix ? fs.prefix + "CancelFullScreen" : "cancelFullscreen"]();
    };

    fs.getFullscreenElement = function() {
        if(fs.supported) return document[fs.prefix ? fs.prefix + "FullscreenElement" : "fullscreenElement"];
    };

    fs.isFullScreen = function() {
        if(!fs.supported) return false;
		if(fs.prefix == "webkit") return document.webkitIsFullScreen;
        else if(fs.prefix) return document[fs.prefix + "FullScreen"];
        return document.fullScreen;
    };

    fs.isElFullscreen = function($el) {
        var fse = fs.getFullscreenElement();
        if(!fse) return null;
		return $($el).is(fse);
    };

    fs.onChange = function(f) {
		$(document).on(fs.prefix + "fullscreenchange", f);
    };

    fs.onError = function(f) {
		$(document).on(fs.prefix + "fullscreenerror", f);
    };

})();

ATVI.components.video = ATVI.components.video || {};


(function($, ATVI) {

    var video = ATVI.components.video;
    var registry = ATVI.utils.createRegistry("atvi-video");

    video.YTScriptLoaded = video.YTScriptLoaded || false;
    video.YTApiReady = video.YTApiReady || false;
    video.playersGenerated = false;

    video.initYtAPI = function(cb) {
        if (!video.YTScriptLoaded) {
            $.getScript('https://www.youtube.com/iframe_api', function() {
                var e = new CustomEvent('youtubeApiScriptLoaded');
				document.dispatchEvent(e);
                video.YTScriptLoaded = true;
                if(cb) cb(); 
            });
        }
    };

    window.onYouTubeIframeAPIReady = function() {
        var e = new CustomEvent('youtubeApiReady'),
            i;
        video.YTApiReady = true;
		document.dispatchEvent(e);

        for (i = 0; i < window.ATVIVideoEls.length; i++) {
            video.generatePlayer(window.ATVIVideoEls[i].$el, window.ATVIVideoEls[i].config);
        }
    };

    video.onPlayerReady = function(event) {
        video.getVideoObj(event);

        var e = new CustomEvent('newOnPlayerReady', {
            detail: {
                e: event
            }
        });
        document.dispatchEvent(e);

        event.target.unMute();

    };

    video.onApiChange = function(event) {};

    video.onPlayerStateChange = function(event) {
        var d = event.data,
            ps = YT.PlayerState,
            $iframeEl = $(event.target[video.youtubeApiTargetNode]),
            youtubeId = $iframeEl.closest('.atvi-video-component').data('youtube-id'),
            videoTitle = $iframeEl.closest('.atvi-video-component').data('video-title') || $iframeEl.closest('div[data-video-title]').data('video-title'),
            $parentEl = $iframeEl.parents('.atvi-video-component'),
            moduleName = $iframeEl.closest('.atvi-experiencefragment').find("> .atvi-module-container").data("analytics-container") || $iframeEl.closest("div[data-analytics-container]").data('analytics-container'),
            context = video.getContext($parentEl),
            obj = {};

        if (context) context.youtubeId = context.youtubeId || youtubeId || context.opts.youtubeId;
        obj.youtubeId = context.youtubeId || youtubeId;
        obj.videoTitle = videoTitle;
        obj.moduleName = moduleName;
        obj.context = context;

        if (d == ps.ENDED && context) {
            context.ended = true;
            context.controls.setPlaying(false);
        }

        if (context && context.customControls && d == ps.PAUSED) context.pause();

        // analytics
        if (d == ps.PLAYING) {
            video.analytics_handlePlay(obj);
        }
        if (d == ps.PAUSED) {
			video.analytics_handlePause(obj);
        }
        if (d == ps.ENDED) {
			video.analytics_handleEnd(obj);
        }

        var e = new CustomEvent('newVideoStateChange', {
            detail: {
				d: d,
                ps: ps,
                c: context
            }
        });

        document.dispatchEvent(e);
    };

    video.analytics_handlePlay = function(obj) {
		var context = obj.context;
        if (!context) return;

        var player = context.ytPlayer,
            duration = player.playerInfo.duration.toFixed(2) || player.getDuration().toFixed(2),
            videoId = (context.opts.isList) ? player.playerInfo.playlist[player.playerInfo.playlistIndex] || player.getPlaylist()[player.getPlaylistIndex()] : context.opts.youtubeId;

        if (!context.played) {
            context.played = true;
        }

        if (duration) {
            var remainingTime = duration - player.playerInfo.currentTime.toFixed(2);
            context.timer = (remainingTime <= duration * .25) ? undefined : setVideoTimer({context: context, duration: duration, remaining: remainingTime});
        }

        if (dataLayer) dataLayer.push({video_title: obj.videoTitle, video_provider: 'youtube', label: videoId, action: 'play', event: 'media', category: 'media', pageURL: window.location.href, gameName: ATVI.dataLayerGameName, module: obj.moduleName});
    };

    video.analytics_handlePause = function(obj) {
        var context = obj.context;
        if (!context) return;
        var player = context.ytPlayer,
            videoId = (context.opts.isList) ? player.playerInfo.playlist[player.playerInfo.playlistIndex] : context.opts.youtubeId;
		if (context.timer) clearTimeout(context.timer);
        context.timer = undefined;
        if (dataLayer) dataLayer.push({label: videoId, action: 'pause', event: 'media', category: 'media', pageURL: window.location.href, gameName: ATVI.dataLayerGameName, module: obj.moduleName});
    };

    video.analytics_handleEnd = function(obj) {
		var context = obj.context;
        if (!context) return;
        var player = context.ytPlayer,
            videoId = (context.opts.isList) ? player.playerInfo.playlist[player.playerInfo.playlistIndex] : context.opts.youtubeId;
        if (context.timer) clearTimeout(context.timer);
        context.timer = undefined;
        if (!context.ended) context.ended = true;
        dataLayer.push({label: videoId, action: 'complete', event: 'media', category: 'media', pageURL: window.location.href, gameName: ATVI.dataLayerGameName, module: obj.moduleName});
    };

    var setVideoTimer = function(obj) {
        var timesArr = [obj.duration * .25, obj.duration * .5, obj.duration * .75],
            elapsed = obj.duration - obj.remaining,
            labels = ['25%', '50%', '75%'],
            timersRequired, timeToFirstTrigger, i;

        for (i = 0; i < timesArr.length; i++) {
            if (i == 0 && elapsed < timesArr[0]) {
                timersRequired = 3;
                timeToFirstTrigger = timesArr[0] - elapsed;
                break;
            }
            if (elapsed < timesArr[i] && elapsed >= timesArr[i - 1]) {
				timersRequired = timesArr.length - i;
				timeToFirstTrigger = timesArr[i] - elapsed;
                break;
            }
        }

        return setTimeout(function() {
            var context = obj.context,
                player = context.ytPlayer,
                videoId = (context.opts.isList) ? player.playerInfo.playlist[player.playerInfo.playlistIndex] : context.opts.youtubeId;
            if (dataLayer) dataLayer.push({label: videoId, action: labels[labels.length - timersRequired], event: 'media', category: 'media', pageURL: window.location.href, gameName: ATVI.dataLayerGameName});
            if (timersRequired > 1) {
                obj.context.timer = setTimeout(function() {
					if (dataLayer) dataLayer.push({label: videoId, action: labels[labels.length - timersRequired + 1], event: 'media', category: 'media', pageURL: window.location.href, gameName: ATVI.dataLayerGameName});
                    if (timersRequired > 2) {
                        obj.context.timer = setTimeout(function() {
                            if (dataLayer) dataLayer.push({label: videoId, action: labels[labels.length - timersRequired + 2], event: 'media', pageURL: window.location.href, gameName: ATVI.dataLayerGameName});
                        }, timesArr[0] * 1000);
                    }
                }, timesArr[0] * 1000);
            }
        }, timeToFirstTrigger * 1000);
    };

    video.generatePlayer = function($wrapperEl, config) {
        if (!config.youtubeId) return;
        var elId = $wrapperEl.attr('id') + '-embed',
            reg = registry.register($wrapperEl),
            context = reg.context,
            playerVarsObj = video.buildYoutubePlayerVars(config),
            customControls = config.customControls,
            ytHost = (window.OptanonActiveGroups && window.OptanonActiveGroups.includes('4')) ? 'https://www.youtube.com' : 'https://www.youtube-nocookie.com';
        context.opts = config;
        context.vendor = 'youtube';
        context.customControls = customControls;
        context.timer = undefined;
        context.timeTriggers = [.25, .5, .75];
        if (!context.ytPlayer) {
            context.ytPlayer = new YT.Player(elId, {
                host: ytHost,
                height: '100%',
                width: '100%',
                videoId: config.youtubeId,
				host: (config.noCookies || (typeof OptanonActiveGroups !== 'undefined' && OptanonActiveGroups.indexOf("2") < 0)) ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com',
                playerVars: playerVarsObj,
                events: {
                    'onApiChange': video.onApiChange,
                    'onReady': video.onPlayerReady,
                    'onStateChange': video.onPlayerStateChange
                }
            });
        }

        //ATVI Video Thumbnail 
        $(document).ready(function() {

            $("#" + $wrapperEl.attr('id')).find(".atvi-video-thumbnail-container").on("click", function() {
    
                $(this).fadeOut();
    
                var vidContext = ATVI.components.video.getContext($wrapperEl);

                //If agegate cookie exists (meaning user passed agegate) or if agegate was disabled 
                if(typeof ATVI.utils.getCookie("agegate") !== 'undefined' || $(this).closest(".atvi-video").find(".atvi-agegate").length <= 0) {
                    vidContext.play();
                }
    
                //If video didn't need agegate?

            });

        });

	};

    video.handleOptanonChange = function() {
        if (ATVI.cookiesAccepted === window.OptanonActiveGroups) return;
		//var allYtEls = document.querySelectorAll('.atvi-video-component'),
            //originalYtProps = [];
        //video.purgeAllContexts();
        /*window.ATVIVideoEls.forEach(function(node) {
            var newEl = document.createElement('div'),
                context = video.getContext(node.$el);
            originalYtProps.push($.extend(true, {}, context.ytPlayer));
            newEl.id = node.$el.attr('id') + '-embed';
            node.$el[0].querySelector('iframe').replaceWith(newEl);
            //node.$el.find('.player').append(newEl);
        }); */

//  swap out iframe and run new YT.Player
        var idSuffix = (window.OptanonActiveGroups.includes('4')) ? '-with-cookies' : '-no-cookies',
            ytHost = (window.OptanonActiveGroups.includes('4')) ? 'https://www.youtube.com' : 'https://www.youtube-nocookie.com',
            originalArrLength = window.ATVIVideoEls.length;

        window.ATVIVideoEls.forEach(function(node, i) {
            var originalId = node.$el.attr('id'),
                newId = node.$el.attr('id') + idSuffix,
                newIframe = document.createElement('iframe'),
                newEl = document.createElement('div'),
                $parentEl = node.$el.parent(),
                context = video.getContext(node.$el),
                playerVarsObj = video.buildYoutubePlayerVars(node.config),
            	customControls = node.config.customControls;


            // replacing iframe results in a good ytPlayer obj but the video is unavailable
            // just update the iframe? ---> video is unavailable
            // destroy iframe ---> replace with new iframe  ----->  video is unavailable


            // this doesn't trigger the onReady event
            /*node.$el.attr('id', newId);
            newEl.id = node.$el.attr('id') + '-embed';
            context.ytPlayer.destroy();
            delete context.ytPlayer;
            node.$el.find('#' + originalId + '-embed').attr('id', newId + '-embed');
            video.purgeContext(node.$el);
            video.generatePlayer(node.$el, node.config);*/

            // get rid of whole original wrapper and children --->  doesn't trigger the onReady event
            /*video.purgeContext(node.$el);
            context.ytPlayer.destroy();
            context.ytPlayer = null;
			$parentEl.empty();
			$parentEl.append(ATVI.utils.buildYoutubeEl(node.config.youtubeId));*/

            // add the same video somewhere else  --->  doesn't trigger the onReady event
			//$('body').append(ATVI.utils.buildYoutubeEl(node.config.youtubeId));

			// use loadVideoByUrl() method after changing iframe src ---->  doesn't trigger the onReady event

        });

        // add a different video to the body --- >  works fine
        //$('body').append(ATVI.utils.buildYoutubeEl('U6HJOO4R5jE'));

        // remove old entries from arr
        window.ATVIVideoEls.splice(0, originalArrLength);

        //video.purgeAllContexts();
/*
        window.ATVIVideoEls.forEach(function(node, i) {
            video.generatePlayer(node.$el, node.config);
            setTimeout(function() {
                if (!video.getContext(node.$el).pause) {
                    //video.getContext(node.$el).ytPlayer = originalYtProps[i];
                    //video.getVideoObj({ target: video.getContext(node.$el).ytPlayer, data: null });
                }
            }, 1500);
        }); */
    };

    video.buildYoutubePlayerVars = function(config) {
        var obj = {};
        obj.controls = (config.customControls) ? 0 : 1;
        obj.enablejsapi = 1;
        obj.modestbranding = 1;
        obj.rel = 0;
        obj.start = config.start;
        obj.autoplay = (config.autoPlay) ? 1: 0;
        obj.mute = (config.autoPlay) ? 1: 0;
        obj.cc_load_policy = (config.customControls) ? 1 : 0;
        obj.suggestedQuality = 'default';
        obj.origin = window.location.origin;
        if (config.isList) {
            obj.listType = 'playlist';
            obj.list = config.youtubeId;
        }
        return obj;
    };

    video.getVideoObj = function(e) {
		if (!e) return;
        var obj = e.target,
            parentId = getYoutubeElId(obj),
            context = video.getContext($('#' + parentId)),
            customControls = context.opts.customControls === 'true';
        if (context.playerReady) return;
        context.playerObj = obj;
        context.playerReady = true;

		context.ytPlayer = (context.ytPlayer) ? context.ytPlayer : undefined;
        context.wrapper = $('#' + parentId);
        context.initialHtml = context.wrapper.find('.player-part').html();
        context.requestedQuality = context.opts.preferredQuality || 'default';
		context.duration = (context.duration) ? context.duration : obj.getDuration();

        video.verifiedInit(context);
        video.onInit(context);
        if (!context.opts.customControls) context.controls.wrapper.hide();
    };

    var getYoutubeElId = function(obj) {
		var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split(''),
            i;
        for (i = alphabet.length - 1; i >= 0; i--) {
            var node = obj[alphabet[i]];
            if (node && 
                node.id && 
                node.id.indexOf('-embed') > -1 &&
                $(node).is('iframe')) {
                video.youtubeApiTargetNode = alphabet[i];
				return obj[alphabet[i]].id.replace('-embed', '');
            }
        }
    };

    video.init = function($el, opts) {
        var context = registry.get($el);
        if (!context) return;
        context.ytPlayer = (context.ytPlayer) ? context.ytPlayer : undefined;
        context.wrapper = $el.parents('.atvi-video');
        context.initialHtml = context.wrapper.find('.player-part').html();
        context.opts = opts;
        context.requestedQuality = opts.preferredQuality || 'default';

        video.verifiedInit(context);
        video.onInit(context);
        return context;
    };

    video.verifiedInit = function(context) {
		video.desktopInit(context);
        context.controls.setMuted(false);
        video.onInit(context);
        return context;
    };

    video.desktopInit = function(context) {
	    setupContext(context);
		buildControlsObject(context);
		setupControls(context);
        initPlayer(context);
    };

    video.getContext = function($elOrId) {
        return registry.get($elOrId);
    };

    video.purgeContext = function($elOrId) {
		return registry.purge($elOrId);
    };

    video.purgeAllContexts = function() {
		registry.purgeAll();
    };

    var buildControlsObject = function(context) {
        var c = context.controls = {};
		var w = c.wrapper = context.wrapper.find(".controls");
		c.playButton = w.find(".play.button");
		c.pauseButton = w.find(".pause.button");
        c.ccButton = w.find(".captions-link");
        c.sdhdButton = w.find(".sd-hd.button");
		c.fullscreenButton = w.find(".fullscreen.button");
        c.clock = w.find(".clock");
        c.currentTime = c.clock.find(".current");
        c.totalTime = c.clock.find(".total");
        c.timeSlider = w.find(".time-slider");
        c.timeSliderLoaded = c.timeSlider.find(".loaded");
		c.timeSliderCurrent = c.timeSlider.find(".filled");
        c.speakerButton = w.find(".speaker.button");
        c.volumeSlider = w.find(".volume-slider");
        c.volumeSliderFilled = c.volumeSlider.find(".filled");

        var totalTime = 1, loadedTime = 0;

        c.setPlaying = function(playing) {
            if (playing) {
                context.wrapper.addClass("playing");
                context.hasPlayed = true;
            } else {
                context.wrapper.removeClass("playing");
            }
            context.playing = playing;
        };

        c.setClock = function(current, total, loaded) {
			c.currentTime.text(video.formatTime(current));
            if (total) {
                totalTime = total;
                c.totalTime.text(video.formatTime(total));
            }

            var currentFrac = current / Math.max(current, totalTime || 1);
			c.timeSliderCurrent.css("width", (currentFrac * 100) + "%");

            c.timeSliderLoaded.css("width", ((loaded || 0) * 100) + "%");
        };

        c.setVolume = function(level) {
            if(level <= 0) {
				this.setMuted(true);
                level = 0;
            } else {
                this.setMuted(false);
            }
            if(level > 1) level = 1;

            context.currentVolume = level;
            updateVolumeSlider();
        };

        var updateVolumeSlider = function() {
            var h = context.muted ? 0 : context.currentVolume * 100;
            c.volumeSliderFilled.css("height", h + "%");
        };

        c.setMuted = function(muted) {
			if (muted) context.wrapper.addClass("muted");
            else {
                context.wrapper.removeClass("muted");
                if(context.currentVolume < .1) context.currentVolume = .1;
            }
            context.muted = muted;
            updateVolumeSlider();
        };

    };

    var setupContext = function(context) {
        context.currentVolume = 1;
		context.player = context.wrapper.find(".player");
        context.isControllable = false;
        context.commandQueue = [];

        context.play = function(arg) {
            if(arg) {
                if(typeof arg == "string") {
                    context.youtubeId = arg;
                } else if(typeof arg == "object") {
					arg.id = arg.id || context.youtubeId || context.vimeoId;
                    arg.time = arg.time || 0;
                } else {
					arg = null;
                }
            }

            context.controls.setPlaying(true);

            if (context.ytPlayer) executeCommand(context, "playVideo", arg);
        	else executeCommand(context, "play", arg);
        };

        context.pause = function() {
            if (context.ytPlayer) executeCommand(context, "pauseVideo");
            else executeCommand(context, "pause");
            context.controls.setPlaying(false);
        };

        context.stop = function() {
            context.controls.setPlaying(false);
        }

        context.seek = function(arg) {
            var command = 'seek';
            if (context.ytPlayer) command = 'seekTo';
            executeCommand(context, command, arg);
            context.controls.setClock(arg);
        };

        context.volume = function(arg) {
            var command = 'volume';
            if (context.ytPlayer) command = 'setVolume';
			return executeCommand(context, command, arg);
        };

        context.mute = function(arg) {
            var mute = 'mute',
                unmute = 'unmute';
            if (context.ytPlayer) unmute = 'unMute';
            executeCommand(context, arg ? mute : unmute);
            context.muted = arg;
        };

        context.captions = function(captions) {
            context.controls.captions = (captions) ? true : false;
        };

        context.cue = function(arg) {
            if (context.youtubeId) {
                updateExternalLink(context, "https://www.youtube.com/watch?v=" + arg);
                context.youtubeId = arg;
                return executeCommand(context, "cue", arg);
            }
        };
        context.setReady = function(ready) {
			if (ready) setReady(context);
            else context.playerReady = false;
        };
        context.reset = function() {
			return reset(context);
        };

        context.eventHandlers = [];
        context.onEvent = function(h) {
			context.eventHandlers.push(h);
        };
        context.triggerEvent = function(e) {
			for(var i = 0; i < context.eventHandlers.length; i++) context.eventHandlers[i](e);
        };


        if (context.opts.muted) context.mute(true);

        video.setupControlDisplay(context);
    };

    var setupControls = function(context) {
		var c = context.controls, w = context.wrapper, p = context.player;
        c.playButton.click(function() {
			context.play();
        });

        c.pauseButton.click(function() {
            console.log("VIDEO PAUSE");
            context.pause()
        });

        c.ccButton.click(function(e) {
			e.preventDefault();
        });

        var tsi = c.timeSlider.find(".inner");

        c.timeSlider.click(function(e) {
            var t, x = e.clientX - tsi.offset().left;
            var w = tsi.width();
            if (x < 0) x = 0;
            else if(x > w) x = w;

            var doSeek = function() {
			    t = (x / w) * (context.duration || 30);
				context.seek(t);
            };

            if (context.hasPlayed) doSeek();
            else {
                var oldSeek = context.cuedSeek;
                context.cuedSeek = doSeek;
                if(oldSeek) return; 
                var test = function() {
                    if(!context.duration) return;
					if(interval) clearInterval(interval);
                    context.pause();
                    context.cuedSeek();
                };
                var interval = setInterval(test, 50);
                test();                
                context.play();
            }

        });

        c.sdhdButton.click(function() {
            if (context.hd) {
				w.removeClass("hd");
                video.updateQuality(context, 'medium');
            } else {
                w.addClass("hd");
                video.updateQuality(context, 'hd720');
            }
			context.hd = !context.hd;
        });

		var vsi = c.volumeSlider.find(".inner");

        c.volumeSlider.click(function(e) {
            var y = e.pageY - vsi.offset().top;
            var h = vsi.height();
            var p = (1 - y / h);

            if(p < 0) p = 0;
            else if(p > 1) p = 1;
            if(p > 0 && context.muted) context.mute(false);
			context.volume(p * 100);
            c.setVolume(p);
        });

        c.speakerButton.click(function() {
			context.mute(!context.muted);
            context.controls.setMuted(context.muted);
        });

        c.fullscreenButton.click(function(e) {
            var cancel = video.onFullscreenClick(context, e);
            if(cancel === false) return;
            handleFullscreenCommand(context, "toggle");
        });

        var fs = ATVI.fullscreen;
        fs.onChange(function(e) {
            var isMe = context.wrapper.is(e.originalEvent.target);
            if(!isMe) return;
            if(fs.isFullScreen()) {
                w.addClass("fullscreen");
                video.onFullscreenEvent(context, true, e);
            }
            else {
                w.removeClass("fullscreen");
                video.onFullscreenEvent(context, false, e);
            }
        });

        context.fullscreenType = video.chooseFullscreenType(context);
        if(!fs.supported && context.fullscreenType == "screen") context.fullscreenType = "browser";

        var po = context.playingOverlay = context.wrapper.find(".playing-overlay");
        po.click(function() {
			context.pause();
        });
        po.on("touchstart", function() {
			video.onHovering(context);
        });
    };

    var executeCommand = function(context, command, arg) {
        if (!context.isControllable) return;

        var comm;
        if (context.ytPlayer) {
            comm = function() {
                context.playerObj[command](arg);
            };
        }

        if (context.playerReady) comm();
        else context.commandQueue.push(comm);
    };

    var initPlayer = function(context) {
        context.isControllable = true;
        var c = {}, controls = context.controls;
        var opts = context.opts;

        c.onPlay = c.onPlayerPlaying = function(id) {
            controls.setPlaying(true);
            context.triggerEvent({type: "play"});
        };
		c.onPause = c.onPlayerPaused = function(id) {
            controls.setPlaying(false);
            context.triggerEvent({type: "pause"});
        };

        c.onStop = function(id) {
			controls.setPlaying(false);
            context.triggerEvent({type: "stop"});
        };

        c.onSeek = function(time) {
            controls.setClock(time);
            context.triggerEvent({type: 'seek', time: time});
        };

        c.onMute = function() {
			controls.setMuted(true);
            context.triggerEvent({type: "mute"});
        };
        c.onUnMute = function() {
            controls.setMuted(false);
            context.triggerEvent({type: "unmute"});
        };
        c.onPlayerBuffering = c.onPlayerCued = function() {

        };

        context.dataInterval = setInterval(function() {
            var data = {};
            if (context.ytPlayer && !$.isEmptyObject(context.ytPlayer.playerInfo)) {
                var p = context.ytPlayer;
				data.currentTime = p.playerInfo.currentTime;
                data.duration = p.playerInfo.duration || p.getDuration();
                data.videoLoadedFraction = p.playerInfo.videoLoadedFraction;
            } else return;
            if ($.isEmptyObject(data)) return;
            controls.setClock(data.currentTime, data.duration, data.videoLoadedFraction);
            context.currentTime = data.currentTime;
            if(data.duration) context.duration = data.duration;
            context.videoUrl = data.videoUrl;
        }, 250);

        video.setupPlayerType(context);
    };

    video.updateQuality = function(context, val) {
        if (context.ytPlayer) {
			if (!val) context.ytPlayer.setPlaybackQuality('default');
            else context.ytPlayer.setPlaybackQuality(val);
        }
    };

    var handleFullscreenCommand = function(context, command) {
        var fs = ATVI.fullscreen,
            isFull = fs.isFullScreen() || context.isFullBrowser,
            targetFull;
        if(command == "enter") targetFull = true;
        else if(command == "exit") targetFull = false;
        else targetFull = !isFull;
		if(targetFull == isFull) return;

		if(!targetFull) {
            if(context.fullscreenType == "screen") video.exitFullscreenMode(context);
            else video.exitFullBrowserMode(context);
            context.isFullBrowser = false;
        } else {
            if(context.fullscreenType == "screen") video.enterFullscreenMode(context);
            else {
                video.enterFullBrowserMode(context);
                context.isFullBrowser = true;
            }
        }
    };

    video.setupPlayerType = function(context) {
        if (ATVI.browser.isPhone) {
			context.wrapper.addClass("use-external-link");
        }
    };

    video.formatTime = function(totalSec) {
		totalSec = Math.round(totalSec || 0);
        var min = Math.floor(totalSec / 60);
        var sec = "0" + (totalSec - min * 60);
        return min + ":" + sec.replace(/^(.*(..))$/, "$2");
    };

    video.chooseFullscreenType = function(context) {
        if(ATVI.browser.isTablet || ATVI.browser.isPhone) return "browser";
        else return "screen";
    };

    video.enterFullscreenMode = function(context) {
        ATVI.fullscreen.request(context.wrapper);
    };

    video.exitFullscreenMode = function(context) {
		ATVI.fullscreen.cancel();
    };

	video.enterFullBrowserMode = function(context) {
        var h = $("html");
        context.htmlOverflow = h.css("overflow");
        h.css("overflow", "hidden");
		context.wrapper.addClass("fullbrowser");
    };

    video.exitFullBrowserMode = function(context) {
        $("html").css("overflow", context.htmlOverflow);
		context.wrapper.removeClass("fullbrowser");
    };

    video.setupControlDisplay = function(context) {
		context.wrapper.mousemove(function() {
			video.onHovering(context);
        });
    };

    video.onHovering = function(context) {
		var w = context.wrapper;

        if(context.hoverTimeout) clearTimeout(context.hoverTimeout);
        else w.addClass("hovered");

        context.hoverTimeout = setTimeout(function() {
            w.removeClass("hovered");
            context.hoverTimeout = null;
        }, 2000);

        if(context.cursorHoverTimeout) clearTimeout(context.cursorHoverTimeout);
        else w.addClass("show-cursor");

        context.cursorHoverTimeout = setTimeout(function() {
            w.removeClass("show-cursor");
            context.cursorHoverTimeout = null;
        }, 3000);
    };

    video.onInit = function(context) {};
	video.onReset = function(context) {};

    video.onFullscreenClick = function(context, ev) {};
    video.onFullscreenEvent = function(context, isFull, ev) {};


    var setReady = function(context) {
		var q = context.commandQueue;
        while(q.length) q.shift()();
        context.playerReady = true;
    };

    var reset = function(context) {
		var html = context.initialHtml;
        var $el = context.wrapper.find(".player-part");
        var opts = context.opts;
        clearInterval(context.dataInterval);
        registry.purge($el);
		$el.html(html);
        var context = video.init($el, opts);

        ATVI.analytics.setupClickHandlers($el);
        video.onReset(context);
        return context;
    };

    var updateExternalLink = function(context, url) {
		context.wrapper.find(".external-link").attr("href", url);
    };

})(jQuery, ATVI);


ATVI.library.registerLibrary("atvi-video");
